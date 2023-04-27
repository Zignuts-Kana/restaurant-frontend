import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  Container,
  Flex,
  Wrap,
  WrapItem,
  IconButton,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { dataState } from "../../context";
import axios from "axios";
import useLocalStorage from "@/utils";
import { useRouter } from "next/router";

function PriceWrapper({ children }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

export default function checkout({ status }) {
  const { isHome, setIsHome, resId, setResId, changeNav, setChangeNav } =
    dataState();
  const [userCart, setCartData] = useState();
  // const [userCart, setCartData] = useLocalStorage("cart", []);
  const [restData, setRestData] = useState();
  const [total, setTotal] = useState(0);
  const fetchData = async (id) => {
    const { data } = await axios.get(
      `http://localhost:1337/api/restaurants/${parseInt(resId)}`
    );
    setRestData(data);
  };
  useEffect(() => {
    fetchData(resId);
  }, [resId]);

  const getTotal = () => {
    let total = 0;
    const cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData) {
      cartData.forEach((cartItem) => {
        total = total + cartItem.price * cartItem.quantity;
      });
    }
    setTotal(total);
  };
  useEffect(() => {
    getTotal();
  }, [userCart, status, changeNav]);
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    setCartData(cartData);
  }, [changeNav]);

  const router = useRouter();
  const placeOrderClicked = (e) => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    const token = localStorage.getItem("token");
    const restaurant = resId;

    const options = {
      method: "POST",
      url: `http://localhost:1337/api/restaurant/order`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        data: {
          restaurant,
          items: cartData,
        },
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status == 200) {
          router.push(`/thankyou/${response.data.id}`);
        }
      })
      .catch((error) => {
        router.push("/failed");
        console.log(error);
      });
  };

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Order Checkout Page
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          By definition, a checkout page is the page(s) related to payment and
          shipping/billing details on an ecommerce store. The checkout page
          gives customers the opportunity to enter payment details and complete
          their order.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="space-around"
        spacing={{ base: 4, lg: 8 }}
        py={10}
      >
        <Flex>
          <Box
            bg="#02054B"
            color="white"
            borderRadius="lg"
            m={{ sm: 4, md: 5, lg: 6 }}
            p={{ sm: 4, md: 5, lg: 8 }}
          >
            <Box>
              <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
                <WrapItem>
                  <Box bg="white" borderRadius="lg">
                    <Box m={8} color="#0B0E3F">
                      <VStack spacing={5}>
                        <FormControl id="name">
                          <FormLabel>Order Name</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none" />
                            <Input type="text" size="md" />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Address 1</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none" />
                            <Input type="text" size="md" />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Address 2</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none" />
                            <Input type="text" size="md" />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>State</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none" />
                            <Input type="text" size="md" />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Country</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none" />
                            <Input type="text" size="md" />
                          </InputGroup>
                        </FormControl>
                      </VStack>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </Box>
        </Flex>
        <PriceWrapper>
          <Box position="relative" width="450px">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                textTransform="uppercase"
                bg={useColorModeValue("red.300", "red.700")}
                px={3}
                py={1}
                color={useColorModeValue("gray.900", "gray.300")}
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Cart Checkout
              </Text>
            </Box>
            <Box py={8} px={12}>
              <Text fontWeight="900" fontSize="2xl">
                {restData && restData.data.attributes.name.toUpperCase()}
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumSignificantDigits: 4,
                    notation: "standard",
                  }).format(total)}
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue("gray.50", "gray.700")}
              py={4}
              borderBottomRadius={"xl"}
            >
              <List spacing={3} textAlign="start" px={12}>
                {!userCart ? (
                  <ListItem>Your cart is empty!</ListItem>
                ) : (
                  userCart.map((item) => {
                    return (
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        {item.quantity} X{" "}
                        <strong>{item.name.toUpperCase()}</strong> OF{" "}
                        {item.price}
                      </ListItem>
                    );
                  })
                )}
              </List>
              <Box w="80%" pt={7}>
                <Button
                  w="full"
                  colorScheme="red"
                  onClick={placeOrderClicked}
                  isDisabled={userCart && userCart.length ? false : true}
                >
                  Place Order
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
      </Stack>
    </Box>
  );
}
