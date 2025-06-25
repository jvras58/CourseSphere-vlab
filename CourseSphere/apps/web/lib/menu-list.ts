import {
  Home,
  Box,
  User,
} from "lucide-react";
export function getMenuList(pathname: string) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Início",
          icon: Home,
          active: pathname === "/",
          submenus: [],
        },
        {
          href: "/perfil",
          label: "Perfil",
          icon: User,
          active: pathname === "/perfil",
          submenus: [],
        },
        {
          href: "/configuracoes",
          label: "Configurações",
          icon: Box,
          active: pathname === "/configuracoes",
          submenus: [],
        },
      ],
    },
  ];
}