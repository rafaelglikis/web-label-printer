import { readFileSync, readdirSync } from 'node:fs'
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

type LucideIconNode = [string, Record<string, string | number | undefined>][]

const fontAwesomeIconModuleId = 'virtual:font-awesome-icons'
const materialIconModuleId = 'virtual:material-icons'
const lucideIconModuleId = 'virtual:lucide-icons'

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

function materialIconData(): Plugin {
  return {
    name: 'material-icon-data',
    resolveId(id) {
      if (id === materialIconModuleId) return id
    },
    load(id) {
      if (id !== materialIconModuleId) return

      const packagePath = fileURLToPath(
        new URL('./node_modules/@material-design-icons/svg/', import.meta.url),
      )
      const styles = ['filled', 'outlined', 'round', 'sharp', 'two-tone']
      const icons = styles.flatMap((style) =>
        readdirSync(`${packagePath}/${style}`)
          .filter((file) => file.endsWith('.svg'))
          .map((file) => {
            const name = file.slice(0, -4)
            const label = name
              .split('_')
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ')

            return {
              name,
              label,
              style,
              searchText: `${name} ${label} ${style}`.toLowerCase(),
            }
          }),
      )

      return `export default ${JSON.stringify(icons)}`
    },
  }
}

function lucideIconData(): Plugin {
  return {
    name: 'lucide-icon-data',
    resolveId(id) {
      if (id === lucideIconModuleId) return id
    },
    load(id) {
      if (id !== lucideIconModuleId) return

      const iconsPath = fileURLToPath(
        new URL('./node_modules/lucide/dist/esm/icons/', import.meta.url),
      )
      const icons = readdirSync(iconsPath)
        .filter((file) => file.endsWith('.mjs'))
        .map((file) => {
          const name = file.slice(0, -4)
          const source = readFileSync(`${iconsPath}/${file}`, 'utf8')
          const match = source.match(/const\s+\w+\s*=\s*(\[[\s\S]*?\]);\s*export/)
          if (!match) throw new Error(`Could not parse Lucide icon: ${file}`)

          const node = Function(`"use strict"; return (${match[1]})`)() as LucideIconNode
          const label = name
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')

          return {
            name,
            label,
            node,
            searchText: `${name} ${label}`.toLowerCase(),
          }
        })
        .sort((a, b) => a.label.localeCompare(b.label))

      return `export default ${JSON.stringify(icons)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [fontAwesomeIconData(), materialIconData(), lucideIconData(), svelte()],
})
