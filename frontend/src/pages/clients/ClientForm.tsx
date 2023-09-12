import { Card } from "@chakra-ui/card";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Container, Flex, Heading } from "@chakra-ui/layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {zodResolver} from '@hookform/resolvers/zod'
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Select } from "@chakra-ui/select";
import axios from "axios";
import { env } from "~/env.mjs";



const ClientForm: NextPage = () => {

    const router = useRouter()

    const ECategory = ["cat-1", "cat-2"] as const

    const schema = z.object({
        fullname: z.string().min(3),
        phone: z.string().min(8),
        category: z.enum(ECategory)
    })

    type Client = z.infer<typeof schema>


    const {
        register, 
        reset, 
        handleSubmit, 
        formState:{errors}
    } = useForm<Client>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: Client) => {
            const res = await axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/register`, data, {withCredentials: true})
            reset()
            router.push("/clients")
    }

    return (
        <Container pt={10}>
            <Heading mb={10} textAlign={'center'}>Agregar cliente</Heading>
            <Card p={5}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel>Nombre completo</FormLabel>
                        <Input 
                            mb={3}
                            type="text"
                            placeholder="Nombre completo"
                            {...register("fullname")}
                            />
                        <FormErrorMessage>{errors.fullname?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Telefono</FormLabel>
                        <Input  
                            mb={3}
                            type="text"
                            placeholder="Telefono"
                            {...register("phone")}
                            />
                        <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.category}>
                        <FormLabel>Categoria</FormLabel>
                        <Select
                        placeholder="Categoria"
                        {...register("category")}
                        >
                            {ECategory.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>

                            ))}
                        </Select>
                        <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                    </FormControl>
                    <ButtonGroup>
                        <Flex gap={2} mt={4}>
                            <Button
                                colorScheme='green' 
                                variant='solid'
                                type="submit"
                            >Agregar</Button>
                            <Button>Cancelar</Button>
                        </Flex>
                    </ButtonGroup>
                </form>
            </Card>
    </Container>
        )
}
export default ClientForm
