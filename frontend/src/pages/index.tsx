import Head from "next/head";
import Link from "next/link";

import styles from "./index.module.css";
import { Button, ButtonGroup, Card } from '@chakra-ui/react'
import { useRouter } from "next/router";
import axios from "axios";
import { env } from "~/env.mjs";


export default function Home() {

  const router = useRouter()

  return (
    <>
    <main>
      <Card>
        <ButtonGroup>
        <Button 
              colorScheme='teal' 
              variant='outline' 
              onClick={() => {
                router.push("/login")
              }}
              >
              Login
            </Button>
            <Button 
              colorScheme='teal' 
              variant='outline' 
              onClick={() => {
                router.push("/clients/ClientForm")
              }}
              >
              Client
            </Button>
        </ButtonGroup>
      </Card>
    </main>
    </>
  );
}
