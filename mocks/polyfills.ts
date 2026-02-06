/**
 * React Native Polyfills for MSW
 * These must be imported before MSW initialization
 */
import "react-native-url-polyfill/auto";
import "fast-text-encoding";

// Cast global to accept our minimal polyfills (avoids strict DOM type mismatch)
type GlobalPolyfills = Omit<
	typeof globalThis,
	"EventTarget" | "Event" | "MessageEvent" | "BroadcastChannel"
> & {
	EventTarget: unknown;
	Event: unknown;
	MessageEvent: unknown;
	BroadcastChannel: unknown;
};

// Polyfill EventTarget for React Native (base class for event handling)
if (typeof global.EventTarget === "undefined") {
	(global as GlobalPolyfills).EventTarget = class EventTarget {
		private listeners: Map<string, Set<EventListener>> = new Map();

		addEventListener(type: string, listener: EventListener) {
			if (!this.listeners.has(type)) {
				this.listeners.set(type, new Set());
			}
			this.listeners.get(type)?.add(listener);
		}

		removeEventListener(type: string, listener: EventListener) {
			const listeners = this.listeners.get(type);
			if (listeners) {
				listeners.delete(listener);
			}
		}

		dispatchEvent(event: Event): boolean {
			const listeners = this.listeners.get(event.type);
			if (listeners) {
				listeners.forEach((listener) => {
					try {
						listener.call(this, event);
					} catch (error) {
						console.error("Error in event listener:", error);
					}
				});
			}
			return !event.defaultPrevented;
		}
	};
}

// Polyfill Event for React Native (required by MessageEvent)
if (typeof global.Event === "undefined") {
	(global as GlobalPolyfills).Event = class Event {
		type: string;
		bubbles: boolean;
		cancelable: boolean;
		defaultPrevented: boolean;
		eventPhase: number;
		timeStamp: number;
		target: EventTarget | null;
		currentTarget: EventTarget | null;
		isTrusted: boolean;

		constructor(type: string, eventInitDict?: EventInit) {
			this.type = type;
			this.bubbles = eventInitDict?.bubbles ?? false;
			this.cancelable = eventInitDict?.cancelable ?? false;
			this.defaultPrevented = false;
			this.eventPhase = 0;
			this.timeStamp = Date.now();
			this.target = null;
			this.currentTarget = null;
			this.isTrusted = false;
		}

		preventDefault() {
			if (this.cancelable) {
				this.defaultPrevented = true;
			}
		}

		stopPropagation() {}
		stopImmediatePropagation() {}
	};
}

// Polyfill MessageEvent for React Native (required by MSW WebSocket/BroadcastChannel)
if (typeof global.MessageEvent === "undefined") {
	const GlobalEvent = (global as GlobalPolyfills).Event as new (
		type: string,
		eventInitDict?: EventInit,
	) => Event;
	(global as GlobalPolyfills).MessageEvent = class MessageEvent extends (
		GlobalEvent
	) {
		data: unknown;
		origin: string;
		lastEventId: string;
		source: MessageEventSource | null;
		ports: MessagePort[];

		constructor(type: string, eventInitDict?: MessageEventInit) {
			super(type, eventInitDict);
			this.data = eventInitDict?.data;
			this.origin = eventInitDict?.origin || "";
			this.lastEventId = eventInitDict?.lastEventId || "";
			this.source = eventInitDict?.source || null;
			this.ports = eventInitDict?.ports || [];
		}
	};
}

// Polyfill BroadcastChannel for React Native (required by MSW WebSocket management)
if (typeof global.BroadcastChannel === "undefined") {
	// Simple in-memory BroadcastChannel implementation for React Native
	const channels = new Map<string, Set<EventTarget>>();
	const GlobalEventTarget = (global as GlobalPolyfills)
		.EventTarget as new () => EventTarget;
	const GlobalMessageEvent = (global as GlobalPolyfills).MessageEvent as new (
		type: string,
		eventInitDict?: MessageEventInit,
	) => MessageEvent;

	(global as GlobalPolyfills).BroadcastChannel =
		class BroadcastChannel extends GlobalEventTarget {
			private name: string;

			constructor(name: string) {
				super();
				this.name = name;

				if (!channels.has(name)) {
					channels.set(name, new Set());
				}
				channels.get(name)?.add(this);
			}

			postMessage(message: unknown) {
				const channelSet = channels.get(this.name);
				if (channelSet) {
					const event = new GlobalMessageEvent("message", {
						data: message,
						origin: "",
					});
					channelSet.forEach((channel) => {
						if (channel !== this) {
							channel.dispatchEvent(event);
						}
					});
				}
			}

			close() {
				const channelSet = channels.get(this.name);
				if (channelSet) {
					channelSet.delete(this);
					if (channelSet.size === 0) {
						channels.delete(this.name);
					}
				}
			}
		};
}
