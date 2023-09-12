import { Card } from "@chakra-ui/card";
import { Container, Heading } from "@chakra-ui/layout";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { env } from "~/env.mjs";
import axios from "axios"
import { Spinner } from "@chakra-ui/spinner";
import ClientList from "components/clients/ClientList";

const ClientsPage: NextPage = () => {

    const {data: clients, isLoading} = useQuery({
        queryKey: ["clients"],
        queryFn: async ()=> {
            const res = await axios
                .get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients`, 
                    {withCredentials: true}
                )
            return res
    }})
    
    return (
        <Container mt={10}>
            <Card p={4}>
                <Heading>Clientes</Heading>
                {isLoading? <Spinner/> : <ClientList clients={clients}/>}
            </Card>
        </Container>
    )
}

export default ClientsPage