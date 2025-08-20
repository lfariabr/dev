import { sendGogginsEmail as sendGogginsEmailService } from '../../services/resendMailer';

export const sendGogginsEmailMutation = async (_: unknown, args: { to: string }) => {
      try {
        const { data, error } = await sendGogginsEmailService(args.to);
        if (error) {
          throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
        }
        return Boolean(data);
      } catch (e: any) {
        throw new Error(e?.message || 'Failed to send email');
      }
    };
