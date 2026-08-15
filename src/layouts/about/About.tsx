import Link from 'next/link'

export const About = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <h1 className="fs-1">Khakim Bakhramov</h1>
      <p className="text-center my-5 fs-3">
        I am a Frontend Developer from Uzbekistan with a background in Economics and a deep passion
        for building polished, user-centric web applications. My journey began during my university
        years, inspired by the innovation of Silicon Valley to transition from self-taught HTML/CSS
        to complex engineering. Combined with an Upper-Intermediate (B2) English proficiency, I
        focus on writing clean, scalable code and delivering high-quality digital experiences.
      </p>
      <Link href="https://rs.school/" className="fs-3" target="_blank">
        RS School
      </Link>
    </div>
  )
}
