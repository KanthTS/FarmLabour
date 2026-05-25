import AnimatedCounter from './AnimatedCounter'
import { usePlatformStats } from '../../hooks/usePlatformStats'

export default function HomeHeroStats({ refreshKey = 0 }) {
  const { stats } = usePlatformStats({ refreshKey })

  const items = [
    { label: 'Farmers', end: stats.farmers, suffix: '' },
    { label: 'Labourers', end: stats.labourers, suffix: '' },
    { label: 'Jobs Posted', end: stats.jobsPosted, suffix: '' },
    { label: 'Success Rate', end: stats.successRate, suffix: '%' },
  ]

  return (
    <div className="home-hero__stats" aria-live="polite">
      {items.map((item) => (
        <div key={item.label}>
          <strong>
            <AnimatedCounter end={item.end} suffix={item.suffix} duration={1.2} />
          </strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
