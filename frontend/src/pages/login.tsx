import { NextPage } from "next";
import style from "../styles/globals.css"
import { 
    Container, 
    Heading,
    Card, CardHeader, CardBody, CardFooter,
    FormControl, FormLabel, FormErrorMessage, FormHelperText, Input,
    Button
} from '@chakra-ui/react'


const Login: NextPage = () => {
    return (
        <Container marginTop={10}>
            <Heading textAlign="center" color=" #243917">Iniciar sesión</Heading>
            <Card padding={4}>
                <form>
                    <FormControl marginBottom={2}>
                        <FormLabel>Email o Usuario</FormLabel>
                        <Input type="email" placeholder="Ingresa tu email o usuario"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contraseña</FormLabel>
                        <Input type="password" placeholder="Ingresa tu contraseña"/>
                    </FormControl>
                    <Button  marginTop={4} colorScheme='teal' variant='outline'>Login</Button>
                </form>
            </Card>
        </Container>
    )
}

export default Login