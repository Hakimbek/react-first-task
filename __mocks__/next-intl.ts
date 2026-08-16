const messages: Record<string, Record<string, string>> = {
  nav: { home: 'Home', about: 'About' },
  search: {
    placeholder: 'Search...',
    invalidateCache: 'Invalidate Cache',
    testError: 'Test Error',
  },
  people: {
    name: 'Name',
    height: 'Height',
    mass: 'Mass',
    hairColor: 'Hair color',
    skinColor: 'Skin color',
    eyeColor: 'Eye color',
    birthYear: 'Birth year',
    gender: 'Gender',
  },
  navigation: { unselectAll: 'Unselect all', download: 'Download' },
  details: { loading: 'Loading...', error: 'Failed to load details.' },
  error: { somethingWentWrong: 'Something went wrong' },
  notFound: { title: '404', message: 'Page not found.', goHome: 'Go back home' },
  about: {
    bio: 'I am a Frontend Developer from Uzbekistan with a background in Economics and a deep passion for building polished, user-centric web applications. My journey began during my university years, inspired by the innovation of Silicon Valley to transition from self-taught HTML/CSS to complex engineering. Combined with an Upper-Intermediate (B2) English proficiency, I focus on writing clean, scalable code and delivering high-quality digital experiences.',
  },
}

export const useTranslations = (namespace: string) => {
  const ns = messages[namespace] ?? {}
  return (key: string) => ns[key] ?? key
}

export const useLocale = () => 'en'

export const hasLocale = (locales: string[], locale: string | undefined) =>
  locales.includes(locale ?? '')
