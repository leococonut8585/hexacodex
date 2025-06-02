import React from 'react';
import { useParams } from 'react-router-dom';
import { getDetailedFeature, DetailedFeatureInfo, Acronym, ComponentAcronym } from '../constants/officialFeatures'; // Assuming officialFeatures.ts is in constants
// import VideoPlayerComponent from '../components/VideoPlayerComponent'; // Placeholder for actual video player

const Personality: React.FC = () => {
  const { finalKey } = useParams<{ finalKey: string }>();
  // Ensure finalKey is not undefined before calling getDetailedFeature
  const feature: DetailedFeatureInfo | null = finalKey ? getDetailedFeature(finalKey) : null;

  // ★★★ デバッグコード追加 ★★★
  console.log("Feature data received in Personality.tsx:", JSON.stringify(feature, null, 2));
  // ★★★ ここまで ★★★

  // Video logic placeholder: Replace with actual video determination logic
  const videoSrc = `/assets/videos/${finalKey}.mp4`; // Example path

  if (!feature) {
    return <div>特徴情報が見つかりません。</div>;
  }

  return (
    <div className="personality-page-container">
      {/* タイトル */}
      <h1 className="personality-title">{feature.catch}</h1>

      {/* 映像 */}
      <div className="video-player-section">
        {/* Replace with actual video player component and logic */}
        {/* <VideoPlayerComponent src={videoSrc} /> */}
        <p><i>Video for {finalKey} would be here. Path: {videoSrc}</i></p>
      </div>

      {/* アクロニム */}
      {feature.acronyms && feature.acronyms.length > 0 && (
        <div className="acronym-section">
          <h2 className="section-title">アクロニム</h2>
          <ul className="acronym-list">
            {feature.acronyms.map((acronym: Acronym, index: number) => (
              <li key={index} className="acronym-item">{acronym.letter}: {acronym.meaning_en}</li>
            ))}
          </ul>
        </div>
      )}
      {feature.componentAcronyms && feature.componentAcronyms.length > 0 && (
        <div className="component-acronym-section">
          <h2 className="section-title">構成アクロニム</h2>
          {feature.componentAcronyms.map((compAcronym: ComponentAcronym, index: number) => (
            <div key={index} className="component-acronym-group">
              <h3 className="subsection-title">{compAcronym.acronym_source_name_en}</h3>
              <ul className="acronym-list">
                {compAcronym.keywords.map((keyword: Acronym, kIndex: number) => (
                  <li key={kIndex} className="acronym-item">{keyword.letter}: {keyword.meaning_en}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* メインタイプの解説 */}
      {feature.baseDescription && (
        <div className="description-section base-description-section">
          <h2 className="section-title">基本特性</h2>
          <p className="description-text">{feature.baseDescription.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
        </div>
      )}

      {/* α/βタイプの解説 */}
      {feature.variantTitle && feature.variant_description_main && (
        <div className="description-section variant-description-section">
          <h2 className="section-title">{feature.variantTitle}</h2>
          <p className="description-text">{feature.variant_description_main.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
        </div>
      )}

      {/* 1/2タイプの解説 */}
      {feature.subTitle && feature.sub_type_description_main && (
        <div className="description-section sub-type-description-section">
          <h2 className="section-title">{feature.subTitle}</h2>
          <p className="description-text">{feature.sub_type_description_main.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
        </div>
      )}
    </div>
  );
};

export default Personality;
