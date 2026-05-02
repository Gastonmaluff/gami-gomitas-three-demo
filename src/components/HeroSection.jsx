import { Sparkles } from 'lucide-react';
import GamiPackScene from './GamiPackScene.jsx';

export default function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="brand-title">
      <div className="hero-copy">
        <p className="eyebrow">Edicion demo interactiva</p>
        <h1 id="brand-title">Gami Gomitas</h1>
        <p className="hero-claim">
          Gomitas brillantes, suaves y con un empaque que cobra vida al tocarlo.
        </p>
        <button className="hero-button" type="button" aria-label="Probar animacion">
          <Sparkles aria-hidden="true" size={18} strokeWidth={2.2} />
          Probar sabor
        </button>
      </div>

      <div className="scene-panel" aria-label="Paquete 3D interactivo de Gami Gomitas">
        <GamiPackScene />
      </div>
    </section>
  );
}
