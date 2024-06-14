import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";


export default function Styles() {
    return (
        <div>
            <h1 className="text-primary">Primary</h1>
            <h1 className="text-foreground">Forground</h1>
            <h1 className="text-accent">Accent</h1>
            <h1 className="text-accent-forground">Accent Forground</h1>
            <h1 className="text-muted">Muted</h1>
            <h1 className="text-background">Background</h1>
            <h1 className="text-background-forground">Background Forground</h1>
            <h1 className="text-error">Error</h1>
            <h1 className="text-warning">Warning</h1>
            <h1 className="text-success">Success</h1>
            <h1 className="text-info">Info</h1>
            <h1 className="text-link">Link</h1>
            <p>Styles page content</p>
            <Button>Click me</Button>
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card content</p>
                </CardContent>
                <CardFooter>
                    <Button>Click me</Button>
                </CardFooter>
            </Card>
            <div className="bg-background text-primary min-w-full">background</div>
            <div className="bg-accent text-primary min-w-full">accent</div>
            <div className="bg-muted text-primary min-w-full">muted</div>
            <div className="bg-foreground text-background min-w-full">forground</div>
        </div>


    );
}