// vite.config.ts
import { defineConfig } from "file:///D:/Sources/iajs/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.4_sass@1.83.0_terser@5.37.0/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///D:/Sources/iajs/node_modules/.pnpm/vite-plugin-dts@4.4.0_@types+node@22.9.4_rollup@4.24.2_typescript@4.9.5_vite@5.4.11_@types+no_yzbodmydikyjpy6okrqhpib2c4/node_modules/vite-plugin-dts/dist/index.mjs";
import tsconfigPaths from "file:///D:/Sources/iajs/node_modules/.pnpm/vite-tsconfig-paths@4.2.3_typescript@4.9.5_vite@5.4.11_@types+node@22.9.4_sass@1.83.0_terser@5.37.0_/node_modules/vite-tsconfig-paths/dist/index.mjs";
import utwm from "file:///D:/Sources/iajs/node_modules/.pnpm/unplugin-tailwindcss-mangle@4.0.2_rollup@4.24.2/node_modules/unplugin-tailwindcss-mangle/dist/vite.js";
import generatePackageJson from "file:///D:/Sources/iajs/node_modules/.pnpm/rollup-plugin-generate-package-json@3.2.0_rollup@4.24.2/node_modules/rollup-plugin-generate-package-json/dist/index.cjs.js";
import cssInjectedByJsPlugin from "file:///D:/Sources/iajs/node_modules/.pnpm/vite-plugin-css-injected-by-js@3.5.2_vite@5.4.11_@types+node@22.9.4_sass@1.83.0_terser@5.37.0_/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname = "D:\\Sources\\iajs\\packages\\iajs-plugin-mobile-ui";
var vite_config_default = defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({ rollupTypes: true, aliasesExclude: ["@xxs3315/iajs"] }),
    utwm({
      classGenerator: {
        classPrefix: "iajs-plugin-mobile-ui-"
      }
    }),
    cssInjectedByJsPlugin(),
    generatePackageJson({
      baseContents: (pkg) => {
        pkg.scripts = {};
        pkg.devDependencies = {};
        pkg.dependencies = {};
        pkg.comment = "";
        pkg.main = "./umd/iajs-plugin-mobile-ui.js";
        pkg.module = "./iajs-plugin-mobile-ui.js";
        pkg.types = "./iajs-plugin-mobile-ui.d.ts";
        pkg.exports = {
          ".": {
            import: "./iajs-plugin-mobile-ui.js",
            require: "./umd/iajs-plugin-mobile-ui.js"
          }
        };
        pkg.files = ["iajs-plugin-mobile-ui.d.ts", "iajs-plugin-mobile-ui.js", "umd/iajs-plugin-mobile-ui.js"];
        return pkg;
      }
    })
    // obfuscatorPlugin({
    //   options: {
    //     compact: true,
    //     debugProtection: true,
    //     controlFlowFlattening: true,
    //     // Your javascript-obfuscator options here
    //     // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
    //   },
    // }),
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "iajs-plugin-mobile-ui",
      // the proper extensions will be added
      // fileName: 'iajs-plugin-mobile-ui',
      fileName: (format, entryName) => {
        return format === "umd" ? `umd/iajs-plugin-mobile-ui.js` : format === "es" ? `iajs-plugin-mobile-ui.js` : `iajs-plugin-mobile-ui.${format}.js`;
      }
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["@xxs3315/iajs"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {}
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTb3VyY2VzXFxcXGlhanNcXFxccGFja2FnZXNcXFxcaWFqcy1wbHVnaW4tbW9iaWxlLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxTb3VyY2VzXFxcXGlhanNcXFxccGFja2FnZXNcXFxcaWFqcy1wbHVnaW4tbW9iaWxlLXVpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Tb3VyY2VzL2lhanMvcGFja2FnZXMvaWFqcy1wbHVnaW4tbW9iaWxlLXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuaW1wb3J0IHV0d20gZnJvbSAndW5wbHVnaW4tdGFpbHdpbmRjc3MtbWFuZ2xlL3ZpdGUnXG5pbXBvcnQgb2JmdXNjYXRvclBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1qYXZhc2NyaXB0LW9iZnVzY2F0b3InXG5pbXBvcnQgZ2VuZXJhdGVQYWNrYWdlSnNvbiBmcm9tICdyb2xsdXAtcGx1Z2luLWdlbmVyYXRlLXBhY2thZ2UtanNvbidcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIGR0cyh7IHJvbGx1cFR5cGVzOiB0cnVlLCBhbGlhc2VzRXhjbHVkZTogWydAeHhzMzMxNS9pYWpzJ10gfSksXG4gICAgdXR3bSh7XG4gICAgICBjbGFzc0dlbmVyYXRvcjoge1xuICAgICAgICBjbGFzc1ByZWZpeDogJ2lhanMtcGx1Z2luLW1vYmlsZS11aS0nLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBjc3NJbmplY3RlZEJ5SnNQbHVnaW4oKSxcbiAgICBnZW5lcmF0ZVBhY2thZ2VKc29uKHtcbiAgICAgIGJhc2VDb250ZW50czogKHBrZykgPT4ge1xuICAgICAgICBwa2cuc2NyaXB0cyA9IHt9XG4gICAgICAgIHBrZy5kZXZEZXBlbmRlbmNpZXMgPSB7fVxuICAgICAgICBwa2cuZGVwZW5kZW5jaWVzID0ge31cbiAgICAgICAgcGtnLmNvbW1lbnQgPSAnJ1xuICAgICAgICBwa2cubWFpbiA9ICcuL3VtZC9pYWpzLXBsdWdpbi1tb2JpbGUtdWkuanMnXG4gICAgICAgIHBrZy5tb2R1bGUgPSAnLi9pYWpzLXBsdWdpbi1tb2JpbGUtdWkuanMnXG4gICAgICAgIHBrZy50eXBlcyA9ICcuL2lhanMtcGx1Z2luLW1vYmlsZS11aS5kLnRzJ1xuICAgICAgICBwa2cuZXhwb3J0cyA9IHtcbiAgICAgICAgICAnLic6IHtcbiAgICAgICAgICAgIGltcG9ydDogJy4vaWFqcy1wbHVnaW4tbW9iaWxlLXVpLmpzJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICcuL3VtZC9pYWpzLXBsdWdpbi1tb2JpbGUtdWkuanMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICAgcGtnLmZpbGVzID0gWydpYWpzLXBsdWdpbi1tb2JpbGUtdWkuZC50cycsICdpYWpzLXBsdWdpbi1tb2JpbGUtdWkuanMnLCAndW1kL2lhanMtcGx1Z2luLW1vYmlsZS11aS5qcyddXG4gICAgICAgIHJldHVybiBwa2dcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gb2JmdXNjYXRvclBsdWdpbih7XG4gICAgLy8gICBvcHRpb25zOiB7XG4gICAgLy8gICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgLy8gICAgIGRlYnVnUHJvdGVjdGlvbjogdHJ1ZSxcbiAgICAvLyAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiB0cnVlLFxuICAgIC8vICAgICAvLyBZb3VyIGphdmFzY3JpcHQtb2JmdXNjYXRvciBvcHRpb25zIGhlcmVcbiAgICAvLyAgICAgLy8gU2VlIHdoYXQncyBhbGxvd2VkOiBodHRwczovL2dpdGh1Yi5jb20vamF2YXNjcmlwdC1vYmZ1c2NhdG9yL2phdmFzY3JpcHQtb2JmdXNjYXRvclxuICAgIC8vICAgfSxcbiAgICAvLyB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ2lhanMtcGx1Z2luLW1vYmlsZS11aScsXG4gICAgICAvLyB0aGUgcHJvcGVyIGV4dGVuc2lvbnMgd2lsbCBiZSBhZGRlZFxuICAgICAgLy8gZmlsZU5hbWU6ICdpYWpzLXBsdWdpbi1tb2JpbGUtdWknLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQsIGVudHJ5TmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gZm9ybWF0ID09PSAndW1kJ1xuICAgICAgICAgID8gYHVtZC9pYWpzLXBsdWdpbi1tb2JpbGUtdWkuanNgXG4gICAgICAgICAgOiBmb3JtYXQgPT09ICdlcydcbiAgICAgICAgICAgID8gYGlhanMtcGx1Z2luLW1vYmlsZS11aS5qc2BcbiAgICAgICAgICAgIDogYGlhanMtcGx1Z2luLW1vYmlsZS11aS4ke2Zvcm1hdH0uanNgXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gbWFrZSBzdXJlIHRvIGV4dGVybmFsaXplIGRlcHMgdGhhdCBzaG91bGRuJ3QgYmUgYnVuZGxlZFxuICAgICAgLy8gaW50byB5b3VyIGxpYnJhcnlcbiAgICAgIGV4dGVybmFsOiBbJ0B4eHMzMzE1L2lhanMnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBQcm92aWRlIGdsb2JhbCB2YXJpYWJsZXMgdG8gdXNlIGluIHRoZSBVTUQgYnVpbGRcbiAgICAgICAgLy8gZm9yIGV4dGVybmFsaXplZCBkZXBzXG4gICAgICAgIGdsb2JhbHM6IHt9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1UsU0FBUyxvQkFBb0I7QUFDblcsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFFakIsT0FBTyx5QkFBeUI7QUFDaEMsT0FBTywyQkFBMkI7QUFQbEMsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsSUFBSSxFQUFFLGFBQWEsTUFBTSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUFBLElBQzVELEtBQUs7QUFBQSxNQUNILGdCQUFnQjtBQUFBLFFBQ2QsYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELHNCQUFzQjtBQUFBLElBQ3RCLG9CQUFvQjtBQUFBLE1BQ2xCLGNBQWMsQ0FBQyxRQUFRO0FBQ3JCLFlBQUksVUFBVSxDQUFDO0FBQ2YsWUFBSSxrQkFBa0IsQ0FBQztBQUN2QixZQUFJLGVBQWUsQ0FBQztBQUNwQixZQUFJLFVBQVU7QUFDZCxZQUFJLE9BQU87QUFDWCxZQUFJLFNBQVM7QUFDYixZQUFJLFFBQVE7QUFDWixZQUFJLFVBQVU7QUFBQSxVQUNaLEtBQUs7QUFBQSxZQUNILFFBQVE7QUFBQSxZQUNSLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUNBLFlBQUksUUFBUSxDQUFDLDhCQUE4Qiw0QkFBNEIsOEJBQThCO0FBQ3JHLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFVSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUE7QUFBQTtBQUFBLE1BR04sVUFBVSxDQUFDLFFBQVEsY0FBYztBQUMvQixlQUFPLFdBQVcsUUFDZCxpQ0FDQSxXQUFXLE9BQ1QsNkJBQ0EseUJBQXlCLE1BQU07QUFBQSxNQUN2QztBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQTtBQUFBO0FBQUEsTUFHYixVQUFVLENBQUMsZUFBZTtBQUFBLE1BQzFCLFFBQVE7QUFBQTtBQUFBO0FBQUEsUUFHTixTQUFTLENBQUM7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
