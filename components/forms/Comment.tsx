"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Button } from "../ui/button";

import { Textarea } from "@/components/ui/textarea";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import AnonAvatar from "../shared/AnonAvatar";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
  authorId: string;
  placeholder?: string;
}

function Comment({
  threadId,
  currentUserImg,
  currentUserId,
  authorId,
  placeholder = "Comment...",
}: Props) {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname,
      authorId
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Textarea
                  rows={2}
                  {...field}
                  placeholder={placeholder}
                  className="no-focus text-light-1 outline-none bg-gray-800/50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" variant="default" className="">
          <AnonAvatar size={32} />
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
