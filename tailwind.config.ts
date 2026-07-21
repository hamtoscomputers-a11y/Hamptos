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
				// The Figma lays every section out on a 1300px column — nav
				// 215..1515, the card rails 218..1515, the mosaic 217..1514.
				// Sections pair `container` with `px-4`, so the max-width has to
				// carry that 16px either side: 1300 + 32.
				'2xl': '1332px'
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
				// Filled portion of each bar in the review histogram.
				star: '#FFBE63',
				surface: {
					DEFAULT: '#FDFDFD',
					line: '#D9D9D9',
					accent: '#E7F4FD',
					// Collapse-toggle chip on the filter sidebar.
					chip: '#B5E1FC',
					// Product-card image well.
					placeholder: '#E7E7E7',
					// Purchase rail: payment-partner card outline, quantity control outline.
					card: '#D4D4D4',
					// Product detail: the active tab's fill.
					tab: '#BDE4FD',
					control: '#B8B8B8',
					muted: '#E5E5E5',
					subtle: '#F3F3F3',
					// Full-bleed band holding the brand wall and the servers rail.
					band: '#F8F8F8',
					// Placeholder fill behind the promo tiles on the blue band.
					tile: '#D3D3D3',
					// "Shop In Best Pricing" panel between the homepage rails.
					panel: '#03324C',
					// Product card: "Fulfilled by Hamtos" chip, and the quotation
					// button on an out-of-stock card.
					badge: '#DAE7FF',
					quote: '#BFD6FF',
					// Ring around the carousel's prev/next arrows.
					arrow: '#B4C8D9',
					// Pastel washes behind the homepage category mosaic tiles.
					'tint-blue': '#EFF8FF',
					'tint-mint': '#EDFFF4',
					'tint-cream': '#FFFAF6',
					'tint-lilac': '#F0F3FF',
				},
				// Stock / delivery affirmatives, sampled from the Figma product card.
				success: {
					DEFAULT: '#2BA459',
					dark: '#00650C',
					light: '#B8E9BD',
					// Product detail purchase rail: "In Stock" and the Add To Cart fill.
					bright: '#1E9F17',
					deep: '#169A48',
				},
				ink: {
					DEFAULT: '#101010',
					// "Shop By Categories" heading.
					jet: '#0A0909',
					// Product detail page: the product title.
					title: '#1F1F1F',
					// Product detail: label on the active tab.
					midnight: '#02273F',
					// Reviews: star-level labels and their counts.
					coal: '#2B2B2B',
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
					// Product card: the struck-through pre-discount price.
					silver: '#939393',
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
