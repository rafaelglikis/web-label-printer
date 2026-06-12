import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

type FontAwesomeStyle = 'solid' | 'regular' | 'brands'

type IconMetadata = {
  unicode: string
  label: string
  search?: {
    terms?: string[]
  }
  familyStylesByLicense?: {
    free?: {
      family: string
      style: FontAwesomeStyle
    }[]
  }
}

const fontAwesomeIconModuleId = 'virtual:font-awesome-icons'

function fontAwesomeIconData(): Plugin {
  return {
    name: 'font-awesome-icon-data',
    resolveId(id) {
      if (id === fontAwesomeIconModuleId) return id
    },
    load(id) {
      if (id !== fontAwesomeIconModuleId) return

      const metadataPath = fileURLToPath(
        new URL(
          './node_modules/@fortawesome/fontawesome-free/metadata/icon-families.json',
          import.meta.url,
        ),
      )
      const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as Record<
        string,
        IconMetadata
      >
      const styles = ['solid', 'regular', 'brands'] satisfies FontAwesomeStyle[]
      const icons = Object.entries(metadata)
        .flatMap(([name, icon]) => {
          const freeStyles = icon.familyStylesByLicense?.free ?? []
          return styles
            .filter((style) =>
              freeStyles.some(
                (freeStyle) =>
                  freeStyle.family === 'classic' && freeStyle.style === style,
              ),
            )
            .map((style) => ({
              name,
              unicode: icon.unicode,
              label: icon.label,
              style,
              searchText: [
                name,
                icon.label,
                style,
                ...(icon.search?.terms ?? []),
              ]
                .join(' ')
                .toLowerCase(),
            }))
        })
        .sort(
          (a, b) =>
            a.label.localeCompare(b.label) || a.style.localeCompare(b.style),
        )

      return `export default ${JSON.stringify(icons)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [fontAwesomeIconData(), svelte()],
})
