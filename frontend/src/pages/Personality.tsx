import React, { useEffect, useState } from 'react';
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
// Also removes parentheses and their content if they exist after the main catchphrase part.
function extractMainCatchphrase(title: string | undefined): string {
    if (!title) return '';
    // First, try to get content within 【】
    let mainPart = title;
    const bracketMatch = title.match(/【([^】]+)】/);
    if (bracketMatch && bracketMatch[1]) {
        mainPart = bracketMatch[1];
    }
    // Then, remove any subsequent Japanese parentheses and their content
    // Example: "ＮＯＡＨ（ノア）　慈愛と調和の体現者" -> "ＮＯＡＨ　慈愛と調和の体現者"
    // Example: "慈愛と調和の体現者" -> "慈愛と調和の体現者"
    mainPart = mainPart.replace(/（[^）]+）/g, '').trim();
    // If there's a space now (like "ＮＯＡＨ　慈愛と調和の体現者"), take the part after the first space.
    // This is to isolate the catchphrase part if the name was included.
    const spaceIndex = mainPart.indexOf('　'); // Full-width space
    if (spaceIndex > -1 && mainPart.substring(0, spaceIndex).match(/^[A-Z]+$/)) { // Check if part before space is all caps (likely the name)
         const potentialCatchphrase = mainPart.substring(spaceIndex + 1).trim();
         if (potentialCatchphrase) return potentialCatchphrase;
    }
    // Fallback for titles like "【キャッチコピー】" or "キャッチコピー"
    return mainPart;
}


const Personality: React.FC = () => {
  const { finalKey } = useParams<{ finalKey: string }>();
  const [feature, setFeature] = useState<DetailedFeatureInfo | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [videoSrc, setVideoSrc] = useState<string>('/movie/default_poster.jpg');

  useEffect(() => {
    if (finalKey) {
      const loadedFeature = getDetailedFeature(finalKey);
      setFeature(loadedFeature);

      if (loadedFeature) {
        // Generate Page Title (Item ①)
        const keyParts = finalKey.split('_'); // e.g., ["KINRYU", "α-2"]
        const baseName = extractBaseName(loadedFeature.mainTypeNameJp); // Extracts "KINRYU"
        
        let variantChar = '';
        let subTypeNum = '';
        if (keyParts[1]) {
          const variantAndSub = keyParts[1].split('-'); // e.g., ["α", "2"]
          variantChar = variantAndSub[0]; // "α"
          subTypeNum = variantAndSub[1]; // "2"
        }
        const subTypeName = subTypeNum === '1' ? 'I型' : subTypeNum === '2' ? 'Ⅱ型' : '';
        setPageTitle(`${baseName} ${variantChar} ${subTypeName}`.trim());

        // Video Logic (Item ②)
        const videoMapKey = formatKeyForVideo(finalKey);
        const videoFileName = getVideoFileForCategory(videoMapKey);
        setVideoSrc(videoFileName ? `/movie/${videoFileName}` : '/movie/default_poster.jpg');
      }
    }
  }, [finalKey]);

  if (!feature) {
    return <div className="loading-message">特徴情報が見つかりません。</div>;
  }
  
  // Prepare parts for titles (Items ⑦ and ⑩)
  const baseNameForTitles = extractBaseName(feature.mainTypeNameJp);
  const variantCharForTitles = finalKey?.split('_')[1]?.split('-')[0] || '';
  const subTypeNumForTitles = finalKey?.split('_')[1]?.split('-')[1] || '';
  const subTypeNameForTitles = subTypeNumForTitles === '1' ? 'I型' : subTypeNumForTitles === '2' ? 'Ⅱ型' : '';


  return (
    <div className="personality-page-container">
      {/* ① ページタイトル (総合タイトル) */}
      <h1 className="personality-main-title">{pageTitle}</h1>

      {/* ② 映像 */}
      <div className="video-player-section">
        <video controls width="100%" key={videoSrc} poster={videoSrc === '/movie/default_poster.jpg' ? videoSrc : undefined}>
          <source src={videoSrc} type="video/mp4" />
          お使いのブラウザは動画タグをサポートしていません。
        </video>
      </div>

      {/* ③ メイン部分（12タイプ）のタイトル */}
      <section className="main-type-title-section section-padding">
        <h2 className="section-title">{feature.mainTypeTitle}</h2>
      </section>

      {/* ④ メイン部分（12タイプ）のタイトルと、その下にキャッチコピー */}
      <section className="main-type-catchphrase-section section-padding">
        <h3 className="subsection-title">{feature.mainTypeTitle}</h3>
        <p className="catchphrase-text">{extractMainCatchphrase(feature.mainTypeCatchphrase)}</p>
      </section>

      {/* ⑤ アクロニム */}
      {feature.mainTypeAcronyms && (
        <section className="acronym-section section-padding">
          <h3 className="subsection-title">Acronyms</h3>
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
                  <h4 className="component-acronym-title">{compAcronym.acronymSourceNameEn} Base</h4>
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
        <h3 className="subsection-title">解説</h3>
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
         <h3 className="subsection-title">キャッチコピー</h3>
        <p className="catchphrase-text">{feature.alphaBetaTypeCatchphrase}</p>
      </section>

      {/* ⑨ αかβ分類の解説 */}
      <section className="alpha-beta-description-section section-padding">
        <h3 className="subsection-title">解説</h3>
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
        <h3 className="subsection-title">キャッチコピー</h3>
        <p className="catchphrase-text">{feature.oneTwoTypeCatchphrase}</p>
      </section>

      {/* ⑫ 1型、Ⅱ型分類の解説 */}
      <section className="one-two-type-description-section section-padding">
        <h3 className="subsection-title">解説</h3>
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
