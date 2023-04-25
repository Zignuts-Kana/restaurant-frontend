import useLocalStorage from "@/utils";
import { Center, Heading, useToast } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function VerifyEmailForm() {
  const [user, setUser] = useLocalStorage("userInfo", "");
  const [token,setToken] = useLocalStorage("token",'');
  const toast = useToast();
  const [otp, setOtp] = useState(0);
  const router = useRouter();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:1337/api/customers/verify`, {
        data: {
          email: user.email,
          phoneNumber: user.phoneNumber,
          otp: parseInt(otp),
        },
      })
      .then((response) => {
        console.log(response.data.authToken);
        if (response.status === 200) {
          setToken(response.data.authToken.toString());
          router.push("/checkout");
        }
      })
      .catch((error) => {
        toast({
          title: `${JSON.stringify(error.response.data.message)}`,
          status: "error",
          duration: 1000,
        });
      });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Form onSubmit={handleFormSubmit}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"sm"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={10}
        >
          <Center>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Verify your Email
            </Heading>
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            We have sent code to your email
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "sm" }}
            fontWeight="bold"
            color={useColorModeValue("gray.800", "gray.400")}
          >
            {user.email} And Phone {user.phoneNumber}
          </Center>
          <FormControl>
            <Center>
              <HStack>
                <PinInput onChange={(e) => setOtp(e)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Center>
          </FormControl>
          <Stack spacing={6}>
            <Button
              isDisabled={otp.length !== 6}
              bg={"blue.400"}
              color={"white"}
              type="submit"
              _hover={{
                bg: "blue.500",
              }}
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Flex>
  );
}
