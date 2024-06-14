import { Form } from "@remix-run/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


export default function Newsletter() {

    return (
        <div>
            <h1 className="text-3xl text-primary font-bold">Sign Up For My Newsletter</h1>
            <p className="text-primary">Be the first to learn about new articles and website updates</p>
            <Form method="POST" >
                <Input type="email" placeholder="Email" />
                <Button type="submit">Sign Up</Button>
            </Form>
        </div>
    );
}