import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ConfirmDialogOptions {
    title: string;
    description: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'warning';
}

export interface ConfirmDialogProps extends ConfirmDialogOptions {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Lanjutkan',
    cancelText = 'Batal',
    variant = 'default',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onOpenChange(false);
        onCancel?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {variant === 'destructive' && (
                            <div className="p-2 rounded-full bg-destructive/10 text-destructive shrink-0">
                                <AlertCircle className="size-5" />
                            </div>
                        )}
                        {variant === 'warning' && (
                            <div className="p-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                        )}
                        {variant === 'default' && (
                            <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                                <Info className="size-5" />
                            </div>
                        )}
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground pt-2 whitespace-pre-line">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function useConfirmDialog() {
    const [state, setState] = useState<{
        open: boolean;
        title: string;
        description: string | React.ReactNode;
        confirmText?: string;
        cancelText?: string;
        variant?: 'default' | 'destructive' | 'warning';
        resolve?: (value: boolean) => void;
    }>({
        open: false,
        title: '',
        description: '',
    });

    const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                open: true,
                ...options,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        state.resolve?.(true);
        setState((s) => ({ ...s, open: false }));
    }, [state]);

    const handleCancel = useCallback(() => {
        state.resolve?.(false);
        setState((s) => ({ ...s, open: false }));
    }, [state]);

    const dialogElement = (
        <ConfirmDialog
            open={state.open}
            onOpenChange={(open) => {
                if (!open) handleCancel();
            }}
            title={state.title}
            description={state.description}
            confirmText={state.confirmText}
            cancelText={state.cancelText}
            variant={state.variant}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirm, dialogElement };
}
