import { Construction } from 'lucide-react';

type ComingSoonProps = {
    title: string;
    description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="border-border-default bg-neutral-primary border p-10 text-center">
            <Construction className="text-brand mx-auto h-10 w-10" />
            <h2 className="text-heading mt-4 text-lg font-bold">{title}</h2>
            <p className="text-body mt-2 text-sm">{description}</p>
        </div>
    );
}
