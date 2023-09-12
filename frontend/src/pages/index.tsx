import Head from "next/head";
import Link from "next/link";

import styles from "./index.module.css";
import { Button, ButtonGroup, Card, Container } from '@chakra-ui/react'
import { useRouter } from "next/router";
import axios from "axios";
import { env } from "~/env.mjs";


export default function Home() {

  const router = useRouter()

  return (
    <Container mt={200}>
      <Card p={10}>
        <ButtonGroup>
        <Button 
              colorScheme='teal' 
              variant='solid' 
              onClick={() => {
                router.push("/login")
              }}
              >
              Login
            </Button>
            <Button 
              colorScheme='green' 
              variant='solid' 
              onClick={() => {
                router.push("/clients/ClientForm")
              }}
              >
              Registar Cliente
            </Button>
            <Button 
              colorScheme='purple' 
              variant='solid' 
              onClick={() => {
                router.push("/clients")
              }}
              >
              Todos los clientes
            </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
}
