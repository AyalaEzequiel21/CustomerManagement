import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import  {QueryClient, QueryClientProvider} from "@tanstack/react-query"


const MyApp: AppType = ({ Component, pageProps }) => {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />;
      </ChakraProvider>
    </QueryClientProvider>
  
)};

export default MyApp;
