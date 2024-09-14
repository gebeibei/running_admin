import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
    shortcuts: [
        {
            'wh-full': 'w-full h-full',
            /** 水平居中 */
            'x-center': 'absolute left-50% translate-x--50%',
            /** 垂直 */
            'y-center': 'absolute top-50% translate-y--50%',
            /** 水平垂直居中 */
            'x-y-center': 'absolute top-50% left-50% translate-x--50% translate-y--50%',
            'flex-col': 'flex flex-col',
            'text-ellipsis': 'truncate',
            'zrx-page-header': 'line-height-24 f-16 fw-bold m-b-16 op-90',
            'flex-0-auto': 'shrink-0 grow-0 flex-basis-auto',
            'zrx-common-page': 'zrx-common-shadow h-full m-x-16 p-x-16 bg-white rd-2 b-1 b-solid b-border',
            'zrx-info-label': 'lh-20 c-font f-14 op-70',
            'zrx-info-value': 'lh-20 c-font f-14',
            'flex-x-auto': 'flex-auto w-0',
            'flex-y-auto': 'flex-auto h-0'
        },
        [/^((is|hint)-)?empty$/, () => 'empty:before:content-empty'],
        [/^(text-)?ellipsis$/, () => 'truncate'],
        [/^text-ellipsis-(\d+)$/, ([, lines]) => `line-clamp-${lines} break-all`],
        // 同时集成水平或者垂直方向的margin、padding
        // m-v-120 --> m-t-120 m-b-120  m-h-120 --> m-l-120 m-r-120
        // m-y-120 --> m-t-120 m-b-120  m-x-120 --> m-l-120 m-r-120
        // p-v-120 --> p-t-120 p-b-120  p-h-120 --> p-l-120 p-r-120
        // p-y-120 --> p-t-120 p-b-120  p-x-120 --> p-l-120 p-r-120
        [
            /^(m|p)-(v|h|x|y)-(\d+)$/,
            ([, key, direction, d]) => {
                const keyMap = {
                    h: ['l', 'r'],
                    v: ['t', 'b'],
                    x: ['l', 'r'],
                    y: ['t', 'b']
                }
                return `${key}-${keyMap[direction][0]}-${d} ${key}-${keyMap[direction][1]}-${d}`
            }
        ],
        // 集成flex布局的样式
        // f-c-c --> flex items-center justify-center
        [
            /^f-((c|s|e)(-(c|s|e|b|a))*)$/,
            ([, , g1, , g2]) => {
                let style = ``
                const temps = [
                    { k: 'c', v: 'center' },
                    { k: 's', v: 'start' },
                    { k: 'e', v: 'end' },
                    { k: 'b', v: 'between' },
                    { k: 'a', v: 'around' }
                ]

                const r1 = temps.find((i) => i.k == g1)
                style = `flex items-${r1?.v || 'center'}`

                if (g2) {
                    const r2 = temps.find((i) => i.k == g2)
                    style += ` justify-${r2?.v || 'center'}`
                }

                return style
            }
        ]
    ],
    transformers: [transformerVariantGroup()],
    presets: [
        presetUno(),
        presetAttributify(),
        presetRemToPx({
            baseFontSize: 4
        })
    ],
    rules: [
        [
            /^f-(\d+)$/,
            ([, d]) => {
                return { 'font-size': `${d}px` }
            }
        ],
        [
            'line-clamp-more',
            { overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': 'var(--line-clamp, 2)', '-webkit-box-orient': 'vertical' }
        ],
        [/^span-(\d+|all)$/, ([, d]) => ({ 'grid-column': d == 'all' ? '1 / -1' : `span ${d}` })],
        [/^across-(\d+)$/, ([, d]) => ({ 'grid-row': `span ${d}` })],
        [
            /^calc-(m?w|m?h)-(\d+)$/,
            ([, hor, d]) => ({ [{ w: 'width', h: 'height', mw: 'max-width', mh: 'max-height' }[hor]]: `calc(100% - ${d}px)` })
        ],
        ['zrx-common-shadow', { 'box-shadow': 'var(--el-box-shadow)' }],
        [/^ls-([\d.]+)$/, ([, d]) => ({ 'letter-spacing': `${d}px` })],
        [/^ff-([\w-]+)$/, ([, d]) => ({ 'font-family': `${d}` })],
        ['f-slight', { color: 'rgba(var(--zrx-font), 0.9)' }],
        ['f-light', { color: 'rgba(var(--zrx-font), 0.7)' }],
        ['content-empty', { content: `"- -"` }]
    ],
    theme: {
        colors: {
            font: 'rgba(var(--zrx-font), var(--un-bg-opacity, 1))',
            primary: 'rgba(var(--zrx-primary), var(--un-bg-opacity, 1))',
            success: 'rgba(var(--zrx-success), var(--un-bg-opacity, 1))',
            error: 'rgba(var(--zrx-error), var(--un-bg-opacity, 1))',
            warning: 'rgba(var(--zrx-warning), var(--un-bg-opacity, 1))',
            border: 'rgba(var(--zrx-border), var(--un-bg-opacity, 1))'
        }
    }
})
