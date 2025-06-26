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
import { CourseList } from "@/modules/courses/components/course-list";
import { CreateEditCourseDialog } from "@/modules/courses/components/create-update-course-dialog";

export const metadata: Metadata = {
  title: "Cursos",
};

export default async function DashboardPage() {
  return (
     <ContentLayout className="pt-8 pb-8 px-4 sm:px-8" title="Cursos">
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
                <Link href="/courses">Cursos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CreateEditCourseDialog />
      </div>
      <div className="mx-10 mt-10 mb-10 space-y-28">
        <CourseList/>
      </div>      
    </ContentLayout>
  );
}