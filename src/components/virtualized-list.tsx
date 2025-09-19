"use client"

import { memo, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export const VirtualizedList = memo(function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5
}: VirtualizedListProps<T>) {
  const totalHeight = items.length * itemHeight
  const visibleItems = Math.ceil(containerHeight / itemHeight)
  
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(0 / itemHeight) - overscan)
    const end = Math.min(items.length, start + visibleItems + overscan * 2)
    return { start, end }
  }, [items.length, itemHeight, visibleItems, overscan])

  const visibleItemsData = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }))
  }, [items, visibleRange])

  const offsetY = visibleRange.start * itemHeight

  return (
    <div 
      className={cn("relative overflow-auto", className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItemsData.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// Hook para optimizar listas grandes
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const totalHeight = items.length * itemHeight
  const visibleItems = Math.ceil(containerHeight / itemHeight)
  
  const getVisibleRange = useCallback((scrollTop: number) => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const end = Math.min(items.length, start + visibleItems + overscan * 2)
    return { start, end }
  }, [items.length, itemHeight, visibleItems, overscan])

  const getVisibleItems = useCallback((scrollTop: number) => {
    const range = getVisibleRange(scrollTop)
    return items.slice(range.start, range.end).map((item, index) => ({
      item,
      index: range.start + index
    }))
  }, [items, getVisibleRange])

  return {
    totalHeight,
    visibleItems,
    getVisibleRange,
    getVisibleItems
  }
}
