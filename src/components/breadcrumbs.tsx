import { usePathname } from "next/navigation";
import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  lastKeyDisplayName?: string;
}

const Breadcrumbs = ({ lastKeyDisplayName }: Props) => {
  const pathname = usePathname();
  const routes = pathname.split("/").filter(Boolean);

  const renderBreadcrumb = (routes: string[]) => {
    return routes.map((segment, index) => {
      const isLast = index === routes.length - 1;
      const href = "/" + routes.slice(0, index + 1).join("/");

      return (
        <Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <span className="text-muted-foreground capitalize">
                {isLast && lastKeyDisplayName
                  ? lastKeyDisplayName
                  : decodeURIComponent(segment)}
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </Fragment>
      );
    });
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"} className="capitalize">
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {renderBreadcrumb(routes)}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
