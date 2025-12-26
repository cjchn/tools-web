import {constantRoute} from "./src/router/router"
import vitePluginSeoPrerender from "vite-plugin-seo-prerender";
export function seoperender(){
    const filterPath = ['/:pathMatch(.*)*', '/404']; // 排除的路径
    return vitePluginSeoPrerender({
        routes: constantRoute.map(routeConfig => routeConfig.path).filter(path => !filterPath.includes(path)),
        network: true,
        // 增加超时时间，避免页面加载超时
        timeout: 60000,
        // removeStyle: true
    })
}