import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailedFeature, DetailedFeatureInfo, Acronym, ComponentAcronym } from '../constants/officialFeatures';
import { getVideoFileForCategory } from '../constants/videoMap';

// Helper function to format finalKey for videoMap
function formatKeyForVideo(finalKey: string | undefined): string {
  if (!finalKey) return '';
  return finalKey
    .replace('_α-', '_ALPHA_')
    .replace('_β-', '_BETA_')
    .toUpperCase();
}

// Helper function to extract main part of type name (e.g., "KINRYU" from "KINRYU (キンリュウ)")
function extractBaseName(typeNameJp: string | undefined): string {
  if (!typeNameJp) return '';
  const match = typeNameJp.match(/^([^(]+)/);
  return match ? match[1].trim() : typeNameJp;
}

// Helper function to extract catchphrase from title (e.g., "慈愛と調和の体現者" from "【ＮＯＡＨ（ノア）　慈愛と調和の体現者】")
function extractActualCatchphrase(fullTitle: string | undefined): string {
    if (!fullTitle) return '';
    // Try to get content within 【】 first
    let potentialCatchphrase = fullTitle;
    const bracketMatch = fullTitle.match(/【([^】]+)】/);
    if (bracketMatch && bracketMatch[1]) {
        potentialCatchphrase = bracketMatch[1];
    }

    // Remove the type name and its Japanese reading in parentheses, e.g., "ＮＯＡＨ（ノア）"
    // This regex looks for an all-caps word, possibly followed by Japanese in parentheses, followed by a space.
    potentialCatchphrase = potentialCatchphrase.replace(/^[A-Z]+（[^）]+）　?/, '').trim();
    // Simpler removal if the above is too specific or fails
    potentialCatchphrase = potentialCatchphrase.replace(/^[A-Z]+　?/, '').trim(); // Remove just all-caps name if no parentheses

    return potentialCatchphrase;
}


const Personality: React.FC = () => {
  const { finalKey } = useParams<{ finalKey: string }>();
  const [feature, setFeature] = useState<DetailedFeatureInfo | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [videoSrc, setVideoSrc] = useState<string>('/movie/default_poster.jpg');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (finalKey) {
      const loadedFeature = getDetailedFeature(finalKey);
      setFeature(loadedFeature);
      setIsPlaying(false); // Reset playing state on feature change

      if (loadedFeature) {
        // Generate Page Title (Item ①)
        const keyParts = finalKey.split('_');
        const baseName = extractBaseName(loadedFeature.mainTypeNameJp);

        let variantChar = '';
        let subTypeNum = '';
        if (keyParts[1]) {
          const variantAndSub = keyParts[1].split('-');
          variantChar = variantAndSub[0];
          subTypeNum = variantAndSub[1];
        }
        const subTypeName = subTypeNum === '1' ? 'I型' : subTypeNum === '2' ? 'Ⅱ型' : '';
        setPageTitle(`${baseName} ${variantChar} ${subTypeName}`.trim());

        // Video Logic (Item ②)
        const videoMapKey = formatKeyForVideo(finalKey);
        const videoFileName = getVideoFileForCategory(videoMapKey);
        const newVideoSrc = videoFileName ? `/movie/${videoFileName}` : '/movie/default_poster.jpg';
        setVideoSrc(newVideoSrc);
        if (videoRef.current && videoRef.current.src !== newVideoSrc) {
            videoRef.current.load(); // Load new video source
        }

      }
    }
  }, [finalKey]);

  if (!feature) {
    return <div className="loading-message">特徴情報が見つかりません。</div>;
  }

  const baseNameForTitles = extractBaseName(feature.mainTypeNameJp);
  const variantCharForTitles = finalKey?.split('_')[1]?.split('-')[0] || '';
  const subTypeNumForTitles = finalKey?.split('_')[1]?.split('-')[1] || '';
  const subTypeNameForTitles = subTypeNumForTitles === '1' ? 'I型' : subTypeNumForTitles === '2' ? 'Ⅱ型' : '';

  return (
    <div className="personality-page-container">
      {/* ① ページタイトル (総合タイトル) */}
      <h1 className="personality-main-title">{pageTitle}</h1>

      {/* ② 映像 */}
      <div className="video-player-section" onClick={togglePlay} style={{ cursor: 'pointer' }}>
        <video
          ref={videoRef}
          controls={false}
          width="100%"
          key={videoSrc}
          poster={videoSrc === '/movie/default_poster.jpg' ? videoSrc : undefined}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline // For better mobile experience
          loop // Optional: if videos should loop
          muted // Optional: if videos should start muted; click will unmute if browser policy allows
        >
          <source src={videoSrc} type="video/mp4" />
          お使いのブラウザは動画タグをサポートしていません。
        </video>
      </div>

      {/* ③ メイン部分（12タイプ）のタイトル */}
      <section className="main-type-fulltitle-section section-padding"> {/* Changed class name for clarity */}
        <h2 className="section-title">{feature.mainTypeTitle}</h2>
      </section>

      {/* ④ メイン部分（12タイプ）のキャッチコピー (タイトルから抽出) */}
      <section className="main-type-extracted-catchphrase-section section-padding"> {/* Changed class name */}
        <p className="catchphrase-text">{extractActualCatchphrase(feature.mainTypeTitle)}</p>
      </section>

      {/* ⑤ アクロニム */}
      {feature.mainTypeAcronyms && (
        <section className="acronym-section section-padding">
          <h2 className="section-title">アクロニム</h2> {/* Changed from h3 and "Acronyms" text */}
          {Array.isArray(feature.mainTypeAcronyms) && !(feature.mainTypeAcronyms as any)[0]?.baseTypeNameJp && (
            <ul className="acronym-list">
              {(feature.mainTypeAcronyms as Acronym[]).map((acronym, index) => (
                <li key={index} className="acronym-item">
                  <span className="acronym-letter">{acronym.letter}:</span> {acronym.meaning_en}
                </li>
              ))}
            </ul>
          )}
          {Array.isArray(feature.mainTypeAcronyms) && (feature.mainTypeAcronyms as any)[0]?.baseTypeNameJp && (
            <div className="component-acronym-container">
              {(feature.mainTypeAcronyms as ComponentAcronym[]).map((compAcronym, index) => (
                <div key={index} className="component-acronym-group">
                  <h3 className="component-acronym-title">{compAcronym.acronymSourceNameEn} Base</h3> {/* Changed from h4 */}
                  <ul className="acronym-list">
                    {compAcronym.keywords.map((keyword, kIndex) => (
                      <li key={kIndex} className="acronym-item">
                        <span className="acronym-letter">{keyword.letter}:</span> {keyword.meaning_en}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ⑥ メイン部分の解説 */}
      <section className="main-type-description-section section-padding">
        <h2 className="section-title">基本特性</h2> {/* Changed from h3 and "解説" */}
        <div className="description-text">
          {feature.mainTypeDescription.split('\n').map((line, i) => (
            <React.Fragment key={i}>{line}<br /></React.Fragment>
          ))}
        </div>
      </section>

      {/* ⑦ メイン部分のタイトル + αかβかをタイトルとして */}
      <section className="alpha-beta-title-section section-padding">
        <h2 className="section-title">{`${baseNameForTitles} ${variantCharForTitles}`}</h2>
      </section>

      {/* ⑧ αかβ分類キャッチコピー */}
      <section className="alpha-beta-catchphrase-section section-padding">
        {/* Removed h3 title "キャッチコピー" */}
        <p className="catchphrase-text">{feature.alphaBetaTypeCatchphrase}</p>
      </section>

      {/* ⑨ αかβ分類の解説 */}
      <section className="alpha-beta-description-section section-padding">
        <h3 className="subsection-title">解説</h3> {/* Kept h3 as it's a subsection of α/β */}
        <div className="description-text">
          {feature.alphaBetaTypeDescription.split('\n').map((line, i) => (
            <React.Fragment key={i}>{line}<br /></React.Fragment>
          ))}
        </div>
      </section>

      {/* ⑩ メイン部分のタイトル + αかβ + 一型か二型か、をタイトルとして */}
      <section className="one-two-type-title-section section-padding">
        <h2 className="section-title">{`${baseNameForTitles} ${variantCharForTitles} ${subTypeNameForTitles}`}</h2>
      </section>

      {/* ⑪ 1型、Ⅱ型分類のキャッチコピー */}
      <section className="one-two-type-catchphrase-section section-padding">
        {/* Removed h3 title "キャッチコピー" */}
        <p className="catchphrase-text">{feature.oneTwoTypeCatchphrase}</p>
      </section>

      {/* ⑫ 1型、Ⅱ型分類の解説 */}
      <section className="one-two-type-description-section section-padding">
        <h3 className="subsection-title">解説</h3> {/* Kept h3 as it's a subsection of 1/2 type */}
        <div className="description-text">
          {feature.oneTwoTypeDescription.split('\n').map((line, i) => (
            <React.Fragment key={i}>{line}<br /></React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Personality;
