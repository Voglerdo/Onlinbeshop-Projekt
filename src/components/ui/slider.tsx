"use client"

import styles from './slider.styles.module.css';

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      styles.sliderLayoutPrimary,
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={styles.sliderPanelPrimary}>
      <SliderPrimitive.Range className={styles.range2} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={styles.sliderIconPrimary} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
