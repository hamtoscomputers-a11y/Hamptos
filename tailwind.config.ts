import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Hamtos brand scale, sampled from the Figma header design.
				// Ordered light -> dark; `brand-700` is the primary blue.
				brand: {
					100: '#DAE7FF',
					200: '#BFD6FF',
					300: '#47A9F6',
					400: '#1C8ACF',
					500: '#1985C9',
					600: '#147FC2',
					700: '#1A74BB',
					800: '#07619A',
					900: '#004672',
					950: '#1A2834',
				},
				// Active-filter chip on the product listing toolbar.
				highlight: '#FF9C56',
				surface: {
					DEFAULT: '#FDFDFD',
					line: '#D9D9D9',
					accent: '#E7F4FD',
					// Collapse-toggle chip on the filter sidebar.
					chip: '#B5E1FC',
					// Product-card image well.
					placeholder: '#E7E7E7',
					muted: '#E5E5E5',
					promo: '#EFF5FF',
					subtle: '#F3F3F3',
				},
				// Stock / delivery affirmatives, sampled from the Figma product card.
				success: {
					DEFAULT: '#2BA459',
					dark: '#00650C',
					light: '#B8E9BD',
				},
				ink: {
					DEFAULT: '#101010',
					// Nav bar / category dropdown fill, per the Figma nav frame.
					navy: '#042B43',
					// Filter sidebar: section headings, option labels, secondary text.
					deep: '#00131F',
					body: '#515151',
					charcoal: '#414141',
					// Pagination: inactive page numbers, and the Next button fill.
					pewter: '#32414E',
					graphite: '#2D2D2D',
					grey: '#777777',
					slate: '#2A4153',
					steel: '#7890A5',
					muted: '#595959',
					soft: '#4F697D',
					faint: '#989494',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'brand-gradient': 'linear-gradient(90deg, #1C8ACF 0%, #1A74BB 100%)',
				// Mint -> ice-blue wash behind the best-seller showcase tiles.
				'promo-gradient': 'linear-gradient(135deg, #DFF5EC 0%, #E7F4FD 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
