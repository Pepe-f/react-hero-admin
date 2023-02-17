import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { useHttp } from '../../hooks/useHttp'
import {
  activeFilterChanged,
  filtersFetched,
  filtersFetching,
  filtersFetchingError
} from '../../actions'
import Spinner from '../spinner/Spinner'

const HeroesFilters = () => {
  const { filters, filtersLoadingStatus, activeFilter } = useSelector(
    state => state.filters
  )
  const dispatch = useDispatch()
  const { request } = useHttp()

  useEffect(() => {
    dispatch(filtersFetching())

    request('http://localhost:3001/filters')
      .then(data => dispatch(filtersFetched(data)))
      .catch(() => dispatch(filtersFetchingError()))
  }, [])

  if (filtersLoadingStatus === 'loading') {
    return <Spinner />
  } else if (filtersLoadingStatus === 'error') {
    return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
  }

  const renderFilters = filters => {
    if (filters.length === 0) {
      return <h5 className='text-center mt-5'>Фильтры не найдены</h5>
    }

    return filters.map(({ name, label, className }) => {
      const btnClass = classNames('btn', className, {
        active: name === activeFilter
      })

      return (
        <button
          key={name}
          id={name}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(name))}
        >
          {label}
        </button>
      )
    })
  }

  return (
    <div className='card shadow-lg mt-4'>
      <div className='card-body'>
        <p className='card-text'>Отфильтруйте героев по элементам</p>
        <div className='btn-group'>{renderFilters(filters)}</div>
      </div>
    </div>
  )
}

export default HeroesFilters
