import FloatingParticles from './FloatingParticles'
import RotatingShapes from './RotatingShapes'

export default function LoginBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124, 58, 237, 0.45), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 50%, rgba(6, 182, 212, 0.2), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(79, 70, 229, 0.35), transparent 45%), linear-gradient(180deg, #030712 0%, #0f172a 40%, #020617 100%)',
        }}
      />
      <div className="login-ambient-glow absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <RotatingShapes />
      <FloatingParticles />
    </div>
  )
}
