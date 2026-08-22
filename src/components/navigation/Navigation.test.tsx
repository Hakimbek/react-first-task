import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './Navigation'
import { useSelectionStore } from '../../services/useSelectionStore.ts'
import { downloadCSV, toCSV } from '../../services/downloadCSV.ts'

jest.mock('../../services/useSelectionStore.ts', () => ({
  useSelectionStore: jest.fn(),
}))

jest.mock('../../services/downloadCSV.ts', () => ({
  downloadCSV: jest.fn(),
  toCSV: jest.fn(),
}))

const mockUseSelectionStore = useSelectionStore as unknown as jest.Mock
const mockDownloadCSV = downloadCSV as jest.Mock
const mockToCSV = toCSV as jest.Mock

const defaultProps = {
  next: 'https://swapi.dev/api/people/?page=3',
  previous: 'https://swapi.dev/api/people/?page=1',
  page: 2,
  onNext: jest.fn(),
  onPrev: jest.fn(),
  isLoading: false,
}

const setSelectionStore = (selected: Map<string, unknown>, clear = jest.fn()) => {
  const state = { selected, clear }
  mockUseSelectionStore.mockImplementation((selector: (s: typeof state) => unknown) =>
    selector(state),
  )
  return state
}

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setSelectionStore(new Map())
  })

  it('renders current page number', () => {
    render(<Navigation {...defaultProps} page={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onNext when next button is clicked', async () => {
    const onNext = jest.fn()
    render(<Navigation {...defaultProps} onNext={onNext} />)
    const [, nextButton] = screen.getAllByRole('button')
    await userEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when previous button is clicked', async () => {
    const onPrev = jest.fn()
    render(<Navigation {...defaultProps} onPrev={onPrev} />)
    const [prevButton] = screen.getAllByRole('button')
    await userEvent.click(prevButton)
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('disables previous button when previous is null', () => {
    render(<Navigation {...defaultProps} previous={null} />)
    const [prevButton] = screen.getAllByRole('button')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button when next is null', () => {
    render(<Navigation {...defaultProps} next={null} />)
    const [, nextButton] = screen.getAllByRole('button')
    expect(nextButton).toBeDisabled()
  })

  it('disables both buttons when isLoading is true', () => {
    render(<Navigation {...defaultProps} isLoading={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => expect(button).toBeDisabled())
  })

  it('enables both buttons when isLoading is false and urls are provided', () => {
    render(<Navigation {...defaultProps} isLoading={false} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => expect(button).not.toBeDisabled())
  })

  it('does not render selection controls when nothing is selected', () => {
    setSelectionStore(new Map())

    render(<Navigation {...defaultProps} />)

    expect(screen.queryByText('Unselect all')).not.toBeInTheDocument()
    expect(screen.queryByText('Download')).not.toBeInTheDocument()
  })

  it('renders selection controls and badge count when items are selected', () => {
    setSelectionStore(
      new Map([
        ['1', { id: '1' }],
        ['2', { id: '2' }],
      ]),
    )

    render(<Navigation {...defaultProps} page={9} />)

    expect(screen.getByText('Unselect all')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls clear when "Unselect all" is clicked', async () => {
    const user = userEvent.setup()
    const clear = jest.fn()
    setSelectionStore(new Map([['1', { id: '1' }]]), clear)

    render(<Navigation {...defaultProps} />)

    await user.click(screen.getByText('Unselect all'))

    expect(clear).toHaveBeenCalledTimes(1)
  })

  it('calls toCSV and downloadCSV with selected rows and correct filename', async () => {
    const user = userEvent.setup()
    const rowA = { id: '1', name: 'Luke' }
    const rowB = { id: '2', name: 'Leia' }
    setSelectionStore(
      new Map([
        ['1', rowA],
        ['2', rowB],
      ]),
    )
    mockToCSV.mockReturnValue('csv-content')

    render(<Navigation {...defaultProps} />)

    await user.click(screen.getByText('Download'))

    expect(mockToCSV).toHaveBeenCalledWith([rowA, rowB])
    expect(mockDownloadCSV).toHaveBeenCalledWith('2_items.csv', 'csv-content')
  })

  it('does not call downloadCSV when selection is empty', async () => {
    setSelectionStore(new Map())

    render(<Navigation {...defaultProps} />)

    expect(screen.queryByText('Download')).not.toBeInTheDocument()
    expect(mockDownloadCSV).not.toHaveBeenCalled()
    expect(mockToCSV).not.toHaveBeenCalled()
  })

  it('page number and nav buttons still work correctly when selection controls are visible', async () => {
    const user = userEvent.setup()
    const onNext = jest.fn()
    setSelectionStore(new Map([['1', { id: '1' }]]))

    render(<Navigation {...defaultProps} onNext={onNext} page={7} />)

    expect(screen.getByText('7')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
