/**
 * Corpos celestes da órbita ambiente do herói. Imagens da NASA/ESA em
 * public/space/ (proveniência em public/space/credits.json), normalizadas por
 * scripts/normalize-discos.mjs: cada disco centralizado preenchendo ~90% do
 * quadro, então uma única máscara radial no CSS serve para todos.
 *
 * A Terra não entra na lista: ela é o fundo do herói.
 */
export type Corpo = {
  id: string;
  img: string;
  /** Cor do brilho ao redor do disco. */
  glow: string;
};

export const corpos: Corpo[] = [
  { id: 'mercurio', img: '/space/mercurio.jpg', glow: 'rgba(205, 200, 192, 0.5)' },
  { id: 'venus', img: '/space/venus.jpg', glow: 'rgba(255, 172, 92, 0.5)' },
  { id: 'marte', img: '/space/marte.jpg', glow: 'rgba(255, 142, 92, 0.5)' },
  { id: 'jupiter', img: '/space/jupiter.jpg', glow: 'rgba(255, 200, 152, 0.42)' },
  { id: 'saturno', img: '/space/saturno.jpg', glow: 'rgba(240, 218, 170, 0.4)' },
  { id: 'urano', img: '/space/urano.jpg', glow: 'rgba(162, 232, 226, 0.45)' },
  { id: 'netuno', img: '/space/netuno.jpg', glow: 'rgba(112, 152, 255, 0.5)' },
];
