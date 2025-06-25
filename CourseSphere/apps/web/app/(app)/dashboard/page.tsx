import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "@/components/content-layout";
import Link from "next/link";
import { Metadata } from "next";
import { CreateEditSampleDialog } from "@/modules/sample/components/create-update-sample-dialog";
import { SampleList } from "@/modules/sample/components/sample-list";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
     <ContentLayout className="pt-8 pb-8 px-4 sm:px-8" title="Dashboard">
      <div className="flex w-full justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Proximo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CreateEditSampleDialog />
      </div>
      <div className="mx-10 mt-10 mb-10 space-y-28">
        <SampleList/>
      </div>      
    </ContentLayout>
  );
}
