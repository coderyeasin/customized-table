import React, { ReactNode } from "react";

interface TableCell {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
export const Th = ({ children, className }: TableCell) => (
  <th scope="col" className={`px-4 py-2 border-b text-justify ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className, onClick }: TableCell) => (
  <td className={`px-4 py-2 ${className}`} onClick={onClick}>
    {children ? children : "-"}
  </td>
);
