import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import FeaturedList from "~/components/featuredlist";
import BlogList from "~/components/bloglist";
import { getIndexPageData } from "~/utils/posts.server";
import { Await, defer, Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import { useForm } from '@conform-to/react';
import { prisma } from "~/utils/prisma.server";
import { ReactNode, Suspense } from "react";
import BlogCategories from "~/components/blogCategories";
import LatestArticle from "~/components/latestArticle";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { honeypot } from "~/utils/honeypot.server";
import { Skeleton } from "~/components/ui/skeleton";

//zod schema for newsletter signup
const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email is invalid'),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Grassy's Notebook" },
    { name: "description", content: "Welcome to my Blog!" },
  ];
};


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  if (!category) {
    console.log('No category');
  }

  return defer({
    indexData: getIndexPageData(category),  // Do not await
  });

}


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  honeypot.check(formData);
  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const email = submission.value.email;

  try {
    // Check if the email already exists
    const existingEmail = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return json({
        success: false,
        error: "This email is already subscribed.",
      });
    }

    // Save the email to the database
    await prisma.newsletter.create({
      data: { email },
    });

    return json({ success: true, message: "Thank you for subscribing!"  });
  } catch (error) {
    return json({ success: false, error: error.message });
  }

  };

export default function Index() {
  const lastResult = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  
	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

  return (
    <div className="flex flex-col flex-1 sm:container max-w-full mt-4 px-6">
      <div className="md:grid md:grid-cols-12">
        <div className="md:col-span-8">
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <Await resolve={data.indexData}>
              {({ latestPost, posts }) => (
                <>
                  <LatestArticle post={latestPost} />
                  <BlogList posts={posts} />
                </>
              )}
            </Await>
          </Suspense>
        </div>
        <div className="flex flex-col md:col-span-4 md:col-start-10 mt-4">
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <Await resolve={data.indexData}>
              {({ featuredPosts, topics }) => (
                <>
                  <FeaturedList featured={featuredPosts} />
                  <BlogCategories topics={topics} />
                </>
              )}
            </Await>
          </Suspense>
          <div className="mt-8">
            <h1 className="text-3xl text-primary font-bold py-4">Sign Up For My Newsletter</h1>
            <p className="text-primary py-2">Be the first to learn about new articles and website updates</p>
            <Form method="POST" className="flex flex-col py-2" id={form.id}>
              <HoneypotInputs />
              <Input id={fields.email.id} name={fields.email.name} type="email" placeholder="Email" className="p-2" required />
              <div id={fields.email.errorId} className="text-destructive">{fields.email.errors}</div>
              {(lastResult as { success: boolean; error: ReactNode })?.success === false && (
                <div className="text-destructive mt-2">
                  {(lastResult as { success: boolean; error: ReactNode })?.error}
                </div>
              )}
              {(lastResult as { success: boolean; error: ReactNode })?.success === true && (
                <div className="text-success mt-2">
                  {(lastResult as { success: boolean; error: ReactNode })?.message}
                </div>
              )}
              <Button type="submit" className="mt-2 py-2">Sign Up</Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

