# Final Result Page Layout

This document summarizes the recommended structure for the diagnosis result view.

## JSX Example
```jsx
<div className="final-result">
  <div className="result-text">
    <h3 className="type-name">{result.category}</h3>
    <p className="catch-copy">{result.catch}</p>
  </div>
  <video className="result-video" src="/movie/TYPE.mp4" autoPlay loop muted playsInline />
  <div className="result-text">
    <ul className="acronym-list">{/* acronym items */}</ul>
    <p>{result.baseDescription}</p>
    {/* additional texts */}
  </div>
</div>
```

## CSS Example
```css
.final-result {
  text-align: center;
}
.final-result video {
  margin: 2rem auto;
  display: block;
}
.final-result .type-name {
  font-size: 2.4rem;
}
.final-result .catch-copy {
  margin-bottom: 2rem;
}
```

The classification name and catch copy are displayed above the video, while acronyms
and detailed descriptions appear below. All blocks are centered with generous
spacing to maintain readability.
