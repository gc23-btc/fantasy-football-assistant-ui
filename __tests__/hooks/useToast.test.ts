import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/useToast'

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.addToast('Test message', 'success')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      message: 'Test message',
      type: 'success',
    })
    expect(result.current.toasts[0].id).toBeDefined()
  })

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.addToast('First message', 'success')
      result.current.addToast('Second message', 'error')
    })

    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts[0].message).toBe('First message')
    expect(result.current.toasts[1].message).toBe('Second message')
  })

  it('should remove a toast by id', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.addToast('Test message', 'success')
    })

    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.removeToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should handle different toast types', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.addToast('Success message', 'success')
      result.current.addToast('Error message', 'error')
      result.current.addToast('Info message', 'info')
      result.current.addToast('Warning message', 'warning')
    })

    expect(result.current.toasts).toHaveLength(4)
    expect(result.current.toasts.map(t => t.type)).toEqual([
      'success',
      'error',
      'info',
      'warning'
    ])
  })

  it('should generate unique ids for toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.addToast('First message', 'success')
      result.current.addToast('Second message', 'success')
    })

    const ids = result.current.toasts.map(t => t.id)
    expect(ids[0]).not.toBe(ids[1])
  })
})
