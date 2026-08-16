import { useTranslations } from 'next-intl'
import { Person } from '../person/Person.tsx'
import type { PersonType } from '../person/Person.tsx'

type PeopleProps = {
  people: PersonType[]
}

export const People = ({ people }: PeopleProps) => {
  const t = useTranslations('people')

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">{t('name')}</th>
                <th scope="col">{t('height')}</th>
                <th scope="col">{t('mass')}</th>
                <th scope="col">{t('hairColor')}</th>
                <th scope="col">{t('skinColor')}</th>
                <th scope="col">{t('eyeColor')}</th>
                <th scope="col">{t('birthYear')}</th>
                <th scope="col">{t('gender')}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <Person key={person.url} {...person} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
