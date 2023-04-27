import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Heading,
  Input,
  Image,
  IconButton,
  Link,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "@/utils";
import { dataState } from "../../context";

export default function Navbar({ status, setStatus }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userCart, setCartData] = useLocalStorage("cart", []);
  const { isHome, setIsHome, resId, setResId, setChangeNav } = dataState();
  const [restData, setRestData] = useState(null);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState(null);
  // if (!router.query.id) {
  //   router.query.id = resId;
  // }
  const removeQuantity = (e, id) => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    cartData.forEach((item, index) => {
      if (item.menuItem === id && item.quantity > 1) {
        if (item.menuItem === id) {
          cartData[index].quantity--;
        }
      }
    });
    setCartData(cartData);
  };
  const addQuantity = (e, id) => {
    // console.log(userCart,id)
    const cartData = JSON.parse(localStorage.getItem("cart"));
    cartData.forEach((item, index) => {
      if (item.menuItem === id) {
        cartData[index].quantity++;
      }
    });
    setCartData(cartData);
  };
  const fetchData = async (id) => {
    const { data } = await axios.get(
      `http://localhost:1337/api/restaurants/${id}`
    );
    setRestData(data);
    localStorage.setItem("restaurants", data.data.id);
  };
  useEffect(() => {
    const id = localStorage.getItem("restaurants");
    if (!router.query.rid || !id) return;
    if (router.query.rid) {
      fetchData(router.query.rid);
    } else {
      fetchData(localStorage.getItem("restaurants"));
    }
  }, [router.query.rid]);

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const logOutClicked = (e) => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    location.reload();
  };
  const getTotal = () => {
    let total = 0;
    const cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData) {
      cartData.forEach((cartItem) => {
        total = total + cartItem.price * cartItem.quantity;
      });
    }
    setTotal(total);
    setChangeNav((prev) => !prev);
  };
  useEffect(() => {
    getTotal();
    setData(JSON.parse(localStorage.getItem("cart")));
  }, [userCart, status]);
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [router.pathname]);
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {isHome ? (
            <Link href={`/restaurant/${restData && restData.data.id}`}>
              <Box textTransform={"uppercase"}>
                {restData && restData.data.attributes.name}
              </Box>
            </Link>
          ) : (
            <Link href={`/restaurant/${restData && restData.data.id}`}>
              <Box textTransform={"uppercase"}>
                {restData && restData.data.attributes.name
                  ? restData.data.attributes.name
                  : "Home"}
              </Box>
            </Link>
          )}
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button
                mt={4}
                onClick={onOpen}
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"green.400"}
                _hover={{
                  bg: "green.300",
                }}
                isDisabled={data && data.length ? false : true}
              >
                Cart
              </Button>
              <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Cart Checkout</ModalHeader>
                  <ModalCloseButton />
                  {data &&
                    data.map((cart) => {
                      return (
                        <ModalBody>
                          <Card
                            alignItems="center"
                            direction={{ base: "column", sm: "row" }}
                            overflow="hidden"
                            variant="outline"
                          >
                            <Image
                              objectFit="cover"
                              // maxW={{ base: "100%", sm: "70px" }}
                              // maxH={{ base: "100%", sm: "70px" }}
                              width="70px"
                              height="70px"
                              src={cart.url}
                              alt="Caffe Latte"
                            />
                            <Stack width={"100%"}>
                              <CardBody
                                padding={3}
                                display={"flex"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                              >
                                <Heading size="sm" textTransform={"uppercase"}>
                                  {cart.name}
                                </Heading>
                                <Flex justifyContent="center">
                                  <IconButton
                                    colorScheme="red"
                                    aria-label="Call Segun"
                                    size="sm"
                                    icon={<ChevronLeftIcon />}
                                    onClick={(e) =>
                                      removeQuantity(e, cart.menuItem)
                                    }
                                  />
                                  <Input
                                    type="number"
                                    paddingBottom="2"
                                    paddingX="2"
                                    value={parseInt(cart.quantity)}
                                    width="10"
                                    border="none"
                                    disabled
                                  />
                                  <IconButton
                                    colorScheme="green"
                                    aria-label="Call Segun"
                                    size="sm"
                                    icon={<ChevronRightIcon />}
                                    onClick={(e) =>
                                      addQuantity(e, cart.menuItem)
                                    }
                                  />
                                </Flex>
                              </CardBody>
                            </Stack>
                          </Card>
                        </ModalBody>
                      );
                    })}
                  <ModalFooter>
                    <Heading left="25px" position="absolute" size="sm">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumSignificantDigits: 4,
                        notation: "standard",
                      }).format(total)}
                    </Heading>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Link href={isLogin ? "/checkout" : "/signup"}>
                      <Button colorScheme="green" variant="ghost">
                        Checkout
                      </Button>
                    </Link>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {isLogin ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem onClick={logOutClicked}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Stack
                  flex={{ base: 1, md: 0 }}
                  justify={"flex-end"}
                  direction={"row"}
                  spacing={6}
                >
                  <Button
                    as={"a"}
                    fontSize={"sm"}
                    fontWeight={400}
                    variant={"link"}
                    href={"/signin"}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={"a"}
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"sm"}
                    fontWeight={600}
                    color={"white"}
                    bg={"pink.400"}
                    href={"/signup"}
                    _hover={{
                      bg: "pink.300",
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
