import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  IconButton,
  Flex,
  Input,
} from "@chakra-ui/react";
import useLocalStorage from "@/utils";
import { useEffect, useState } from "react";
import { dataState } from "../../context";

export default function ProductSimple({ menuItem, images ,setStatus}) {
  const { changeNav, setChangeNav } =
  dataState();
  const [userCart, setCartData] = useLocalStorage("cart", []);
  const [isAlready, setIsAlready] = useState(true);
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    setCartData(cartData)
    setStatus(prev=>!prev)
  },[changeNav])
  // const [userCart, setCartData] = useState(
  //   JSON.parse(localStorage.getItem("cart"))
  // );

  const addButtonClicked = (e, id) => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData && cartData.length > 0) {
      const createNew = cartData.filter((c) => c.id === id);
      if (!createNew.length) {
        cartData.push({
          menuItem: id,
          url: `http://localhost:1337${menuItem.attributes.image.data[0].attributes.url}`,
          price: menuItem.attributes.price,
          name: menuItem.attributes.name,
          quantity: 1,
        });
      }
      menuItem.quantity = 1;
      setCartData(cartData);
    } else {
      menuItem.quantity = 1;
      setCartData([
        {
          menuItem: id,
          url: `http://localhost:1337${menuItem.attributes.image.data[0].attributes.url}`,
          name: menuItem.attributes.name,
          price: menuItem.attributes.price,
          quantity: 1,
        },
      ]);
    }
    setStatus(prev=>!prev)
  };

  const removeQuantity = (e, id) => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    cartData.forEach((item, index) => {
      if (item.menuItem === id && item.quantity > 1) {
        if (item.menuItem === id) {
          cartData[index].quantity--;
          menuItem.quantity--;
        }
      }
    });
    setCartData(cartData);
    setStatus(prev=>!prev)
  };
  const addQuantity = (e, id) => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    cartData.forEach((item, index) => {
      if (item.menuItem === id) {
        cartData[index].quantity++;
        menuItem.quantity++;
      }
    });
    setCartData(cartData);
    setStatus(prev=>!prev)
  };
  useEffect(() => {
    setIsAlready(userCart.some((a) => a.menuItem === menuItem.id));
    const cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData) {
      cartData.map((item) => {
        if (item.menuItem === menuItem.id) {
          menuItem.quantity = parseInt(item.quantity);
        }
      });
    }
  }, [userCart]);

  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"230px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"150px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url('http://localhost:1337${menuItem.attributes.image.data[0].attributes.url}')`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={150}
            width={150}
            objectFit={"cover"}
            src={`http://localhost:1337${menuItem.attributes.image.data[0].attributes.url}`}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {menuItem.attributes.name}
          </Text>
          <Heading fontSize={"sm"} fontFamily={"body"} fontWeight={400}>
            {menuItem.attributes.description}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={600} fontSize={"xl"}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumSignificantDigits: 4,
                notation: "compact",
              }).format(menuItem.attributes.price)}
            </Text>
            <Text textDecoration={"line-through"} color={"gray.600"}></Text>
          </Stack>
          {/* {console.log(userCart.some((a) => a.menuItem !== menuItem.id))} */}
          {userCart.length > 0 ? (
            !isAlready ? (
              <Button
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"red.400"}
                _hover={{
                  bg: "red.300",
                }}
                onClick={(e) => addButtonClicked(e, menuItem.id)}
              >
                Add
              </Button>
            ) : (
              <Flex justifyContent="center">
                <IconButton
                  colorScheme="red"
                  aria-label="Call Segun"
                  size="sm"
                  icon={<ChevronLeftIcon />}
                  onClick={(e) => removeQuantity(e, menuItem.id)}
                />
                <Input
                  type="number"
                  paddingBottom="2"
                  paddingX="2"
                  value={parseInt(menuItem.quantity)}
                  width="10"
                  border="none"
                  disabled
                />
                <IconButton
                  colorScheme="green"
                  aria-label="Call Segun"
                  size="sm"
                  icon={<ChevronRightIcon />}
                  onClick={(e) => addQuantity(e, menuItem.id)}
                />
              </Flex>
            )
          ) : (
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"red.400"}
              _hover={{
                bg: "red.300",
              }}
              onClick={(e) => addButtonClicked(e, menuItem.id)}
            >
              Add
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
}
