import { ThemeProvider, CSSReset, Box } from "@chakra-ui/core";
import "./app.css";
import theme from "../theme";
import { useFetchMorePosts } from "../utils/useFetchMorePosts";

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
