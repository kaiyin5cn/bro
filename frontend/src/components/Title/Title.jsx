import './Title.css'

function Title() {
  const words = ["Shortening", "URL"]
  
  return (
    <h1 className="title">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="word">
          {word.split('').map((char, charIndex) => (
            <span key={charIndex} className="char">{char}</span>
          ))}
          {wordIndex < words.length - 1 && <span className="space"> </span>}
        </span>
      ))}
    </h1>
  )
}

export default Title