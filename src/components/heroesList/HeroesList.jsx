import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useHttp } from '../../hooks/useHttp'
import {
  heroDeleted,
  heroesFetched,
  heroesFetching,
  heroesFetchingError
} from '../../actions'
import Spinner from '../spinner/Spinner'
import HeroesListItem from '../heroesListItem/HeroesListItem'

import './heroesList.scss'

const HeroesList = () => {
  const filteredHeroesSelector = createSelector(
    state => state.filters.activeFilter,
    state => state.heroes.heroes,
    (filter, heroes) => {
      if (filter === 'all') {
        return heroes
      } else {
        return heroes.filter(item => item.element === filter)
      }
    }
  )
  const filteredHeroes = useSelector(filteredHeroesSelector)
  const heroesLoadingStatus = useSelector(
    state => state.heroes.heroesLoadingStatus
  )
  const dispatch = useDispatch()
  const { request } = useHttp()

  useEffect(() => {
    dispatch(heroesFetching())
    request('http://localhost:3001/heroes')
      .then(data => dispatch(heroesFetched(data)))
      .catch(() => dispatch(heroesFetchingError()))
  }, [])

  const onDelete = useCallback(
    id => {
      request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .then(dispatch(heroDeleted(id)))
        .catch(e => console.log(e))
    },
    [request]
  )

  if (heroesLoadingStatus === 'loading') {
    return <Spinner />
  } else if (heroesLoadingStatus === 'error') {
    return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
  }

  const renderHeroesList = heroes => {
    if (heroes.length === 0) {
      return (
        <CSSTransition timeout={0} classNames='hero'>
          <h5 className='text-center mt-5'>Героев пока нет</h5>
        </CSSTransition>
      )
    }

    return heroes.map(({ id, ...props }) => {
      return (
        <CSSTransition key={id} timeout={500} classNames='hero'>
          <HeroesListItem {...props} onDelete={() => onDelete(id)} />
        </CSSTransition>
      )
    })
  }

  return (
    <TransitionGroup component='ul'>
      {renderHeroesList(filteredHeroes)}
    </TransitionGroup>
  )
}

export default HeroesList
