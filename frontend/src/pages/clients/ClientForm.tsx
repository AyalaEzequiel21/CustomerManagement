import { Card } from "@chakra-ui/card";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Container, Heading } from "@chakra-ui/layout";
import { NextPage } from "next";

const ClientForm = () => {
    return (
        <main>
            <Container>
                <Heading m={5} textAlign={'center'}>Agregar cliente</Heading>
                <Card p={5}>
                <form>
                    <FormControl>
                        <FormLabel>Nombre completo</FormLabel>
                        <Input type="text"/>
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Telefono</FormLabel>
                        <Input type="text"/>
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel></FormLabel>
                        <Input/>
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                </form>
            </Card>
            </Container>
        </main>
        )
}
export default ClientForm
