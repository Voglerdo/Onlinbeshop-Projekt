"use client"

import styles from './calendar.styles.module.css';

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.calendarUtilityPrimary, className)}
      classNames={{
        months: styles.variantMonths,
        month: styles.variantMonth,
        caption: styles.variantCaption,
        caption_label: styles.variantCaptionLabel,
        nav: styles.variantNav,
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          styles.calendarUtilitySecondary
        ),
        nav_button_previous: styles.variantNavButtonPrevious,
        nav_button_next: styles.variantNavButtonNext,
        table: styles.variantTable,
        head_row: styles.variantHeadRow,
        head_cell:
          styles.calendarTextPrimary,
        row: styles.variantRow,
        cell: styles.variantCell,
        day: cn(
          buttonVariants({ variant: "ghost" }),
          styles.calendarUtilityTertiary
        ),
        day_range_end: "day-range-end",
        day_selected:
          styles.calendarUtilityQuaternary,
        day_today: styles.variantDayToday,
        day_outside:
          styles.calendarUtilityQuinary,
        day_disabled: styles.variantDayDisabled,
        day_range_middle:
          styles.calendarUtilityQuinary,
        day_hidden: styles.variantDayHidden,
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn(styles.calendarIconPrimary, className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn(styles.calendarIconPrimary, className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
