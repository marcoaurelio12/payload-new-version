# Alinhadamente - Design Tokens

## Cores Primárias

| Nome | HEX | Uso |
|------|-----|-----|
| Quase Preto | `#191919` | Texto principal e letra "A" do logotipo |
| Verde Brilhante | `#40ce2a` | Acento/ponto do logotipo de texto |
| Branco | `#ffffff` | Fundos claros, texto sobre escuro |

## Cores Secundárias (Grayscale)

| Nome | HEX | CSS Variable |
|------|-----|--------------|
| American Silver | `#D1D1D1` | `--gray-100` |
| Silver Foil | `#AEAEAE` | `--gray-200` |
| Philippine Gray | `#8B8B8B` | `--gray-300` |
| Dim Gray | `#696969` | `--gray-400` |
| Davys Grey | `#5C5C5C` | `--gray-500` |
| Black Olive | `#3D3D3D` | `--gray-600` |
| Eirie Black | `#1F1F1F` | `--gray-700` |
| Black | `#000000` | `--gray-800` |

## CSS Variables para usar nos componentes

```css
:root {
  /* Brand Primary */
  --brand-black: #191919;
  --brand-green: #40ce2a;
  --brand-white: #ffffff;

  /* Brand Grayscale */
  --gray-100: #D1D1D1;
  --gray-200: #AEAEAE;
  --gray-300: #8B8B8B;
  --gray-400: #696969;
  --gray-500: #5C5C5C;
  --gray-600: #3D3D3D;
  --gray-700: #1F1F1F;
  --gray-800: #000000;
}
```

## Uso nos Componentes

- **Texto principal**: `var(--brand-black)` ou `var(--gray-700)`
- **Texto secundário**: `var(--gray-400)` a `var(--gray-500)`
- **Acentos/CTAs**: `var(--brand-green)`
- **Fundos escuros**: `var(--gray-700)` a `var(--gray-800)`
- **Bordas**: `var(--gray-200)` a `var(--gray-300)`
