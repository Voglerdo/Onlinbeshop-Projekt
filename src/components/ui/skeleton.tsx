import styles from './skeleton.styles.module.css';
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(styles.skeletonPanelPrimary, className)}
      {...props}
    />
  )
}

export { Skeleton }
