import { NextPage } from "next";
import { 
    Container, 
    Heading,
    Card, CardHeader, CardBody, CardFooter,
    FormControl, FormLabel, FormErrorMessage, FormHelperText, Input,
    Button
} from '@chakra-ui/react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { env } from "~/env.mjs";
import { useRouter } from "next/router";


const Login: NextPage = () => {

    const {register, getValues} = useForm()
    const router = useRouter()

    return (
        <Container marginTop={10}>
            <Heading textAlign="center" className="cg">Iniciar sesión</Heading>
            <Card padding={8}>
                <form>
                    <FormControl marginBottom={2}>
                        <FormLabel>Email o Usuario</FormLabel>
                        <Input 
                            type="text" 
                            placeholder="Ingresa tu email o usuario"
                            {...register("email")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contraseña</FormLabel>
                        <Input 
                            type="password" 
                            placeholder="Ingresa tu contraseña"
                            {...register("password")}
                        />
                    </FormControl>
                    <Button 
                        marginTop={4} 
                        colorScheme='teal' 
                        variant='outline'
                        onClick={() => {
                            const userData = {
                                email: getValues("email"),
                                password: getValues("password")
                            }

                            axios
                                .post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, userData)
                                .then(router.push("/home"))
                                .catch(error => console.log(error)
                                )
                        }}
                        >Login</Button>
                </form>
            </Card>
        </Container>
    )
}

export default Login