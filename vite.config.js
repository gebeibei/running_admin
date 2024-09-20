import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import unocss from 'unocss/vite'
// element-plus按需引入依赖的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig(({ command }) => {
    return {
        base: mode === 'production' ? 'running_admin' : './',
        plugins: [
            vue(),
            unocss(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'], // 自动引入vue,vue-router,pinia的方法
                resolvers: [],
                dts: true,
                eslintrc: {
                    enabled: true
                },
                dirs: ['src/hooks']
            }),
            Components({
                dirs: ['src/components/'],
                extensions: ['vue'],
                deep: true,
                // 生成components.d.ts
                dts: true,
                resolvers: []
            })
        ],
        resolve: {
            alias: {
                '@': '/src',
                '~@': '/src'
            },
            extensions: ['.vue', '.js', '.json']
        },
        css: {
            postcss: {
                plugins: [autoprefixer]
            },
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/style/variable.scss";@import "@/zrxAdminPlus/assets/style/common/variable.scss";`
                }
            }
        },
        server: {
            port: 8096,
            host: '0.0.0.0',
            https: false
        }
    }
})
